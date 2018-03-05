from __future__ import division

import cv2
import numpy as np

# import the necessary packages
from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2

    # # initialize the camera and grab a reference to the raw camera capture
    # camera = PiCamera()
    # rawCapture = PiRGBArray(camera)

    # # allow the camera to warmup
    # time.sleep(0.1)

    # # grab an image from the camera
    # camera.capture(rawCapture, format="bgr")
    # image = rawCapture.array
def contour(image):


    # Convert to HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)

    # Define range of white color in HSV
    lower_white = np.array([0, 0, 212])
    upper_white = np.array([131, 255, 255])

    # Threshold the HSV image
    mask = cv2.inRange(hsv, lower_white, upper_white)
    output = cv2.bitwise_and(image, image, mask=mask)

    # Remove noise
    kernel_erode = np.ones((4,4), np.uint8)
    eroded_mask = cv2.erode(mask, kernel_erode, iterations=1)
    kernel_dilate = np.ones((6,6),np.uint8)
    dilated_mask = cv2.dilate(eroded_mask, kernel_dilate, iterations=1)

    # Find the different contours
    im2, contours, hierarchy = cv2.findContours(dilated_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    if len(contours) != 0:


        #find the biggest area
        c = max(contours, key = cv2.contourArea)

        # draw in blue the contours that were founded
        cv2.drawContours(image, c, -1, 255, 3)

        ##x,y,w,h = cv2.boundingRect(c)
        # draw the book contour (in green)
        ##cv2.rectangle(output,(x,y),(x+w,y+h),(0,255,0),2)

    # show the images
    #cv2.imshow("Result", np.hstack([image, output]))

    cv2.imshow("Result",image)

    key = cv2.waitKey(1)  & 0xFF  #for 64 bit
    if key == ord('q'):
        return False
    return True