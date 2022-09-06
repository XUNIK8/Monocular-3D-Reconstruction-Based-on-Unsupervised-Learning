#coding:utf-8

from __future__ import absolute_import, division, print_function

import cv2
import base64
import string
import random
import json
import os
import sys
import glob
import argparse
import numpy as np
import PIL.Image as pil
import matplotlib as mpl
import matplotlib.cm as cm
from flask import Flask, request, redirect, url_for, render_template, send_file
import torch
from torchvision import transforms, datasets

import networks
from layers import disp_to_depth
from utils import download_model_if_doesnt_exist
from evaluate_depth import STEREO_SCALE_FACTOR

app = Flask(__name__)

name_dest_im = ''
name = ''

def generate_filename():
    a = random.choices(string.ascii_lowercase, k=20)
    path = ''.join(a) + '.jpg'
    name = ''.join(a)
    return path, name

@app.route('/', methods=['POST'])

def test_simple():
    global name_dest_im
    global name
    print('Received')

    device = torch.device("cpu")

    download_model_if_doesnt_exist("mono+stereo_640x192")
    model_path = os.path.join("models", "mono+stereo_640x192")
    print("-> Loading model from ", model_path)
    encoder_path = os.path.join(model_path, "encoder.pth")
    depth_decoder_path = os.path.join(model_path, "depth.pth")

    # LOADING PRETRAINED MODEL
    print("   Loading pretrained encoder")
    encoder = networks.ResnetEncoder(18, False)
    loaded_dict_enc = torch.load(encoder_path, map_location=device)

    # extract the height and width of image that this model was trained with
    feed_height = loaded_dict_enc['height']
    feed_width = loaded_dict_enc['width']
    filtered_dict_enc = {k: v for k, v in loaded_dict_enc.items() if k in encoder.state_dict()}
    encoder.load_state_dict(filtered_dict_enc)
    encoder.to(device)
    encoder.eval()

    print("   Loading pretrained decoder")
    depth_decoder = networks.DepthDecoder(
        num_ch_enc=encoder.num_ch_enc, scales=range(4))

    loaded_dict = torch.load(depth_decoder_path, map_location=device)
    depth_decoder.load_state_dict(loaded_dict)

    depth_decoder.to(device)
    depth_decoder.eval()

    uploaded_file = request.files['file']
    if uploaded_file.filename[-3:] in ['jpg', 'JPG', 'JPEG', 'PNG', 'png', 'TIF', 'tif', 'PSD', 'psd', 'BMP',
                                       'bmp']:
        path_new, name = generate_filename()
        image_path = os.path.join("images/", path_new)
        print('ImgPath:', image_path)
        uploaded_file.save(image_path)

        output_directory = image_path

        print('out_directory:',output_directory)

        with torch.no_grad():

            input_image = pil.open(image_path).convert('RGB')
            print('imgshape:',np.shape(input_image))
            original_width, original_height = input_image.size
            input_image = input_image.resize((feed_width, feed_height), pil.LANCZOS)
            input_image = transforms.ToTensor()(input_image).unsqueeze(0)

            # PREDICTION
            input_image = input_image.to(device)
            features = encoder(input_image)
            outputs = depth_decoder(features)

            disp = outputs[("disp", 0)]
            disp_resized = torch.nn.functional.interpolate(disp, (original_height, original_width), mode="bilinear", align_corners=False)

            # Saving numpy file
            output_name = os.path.splitext(os.path.basename(image_path))[0]
            print('outName:',output_name)
            scaled_disp, depth = disp_to_depth(disp, 0.1, 100)

            disp_resized_np = disp_resized.squeeze().cpu().numpy()
            vmax = np.percentile(disp_resized_np, 95)
            normalizer = mpl.colors.Normalize(vmin=disp_resized_np.min(), vmax=vmax)
            mapper = cm.ScalarMappable(norm=normalizer, cmap='magma')
            colormapped_im = (mapper.to_rgba(disp_resized_np)[:, :, :3] * 255).astype(np.uint8)
            im = pil.fromarray(colormapped_im)

            name_dest_im = 'images/'+output_name + '_disp.jpg'
            print('name_dest_im:',name_dest_im)
            im.save(name_dest_im)

            print(" Processed images - saved predictions")

            f2 = open(name_dest_im, "rb")
            res2 = f2.read()
            generated = base64.b64encode(res2)

            print('-> Done!')
            return generated


if __name__=="__main__":
    # server = pywsgi.WSGIServer(('0.0.0.0', 8015), app)
    # server.serve_forever()
    # app.run(debug=1,host="127.0.0.1", port=8015, threaded=True)

    context = (sys.path[0] + '/Nginx/1_www.inifyy.cn_bundle.crt', sys.path[0] + '/Nginx/2_www.inifyy.cn.key')
    app.run(debug=1, host='172.17.0.3', port=8015, ssl_context=context)

