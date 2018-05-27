'''
    Getting the colors of the object in the video frame
    05/03/2017

'''
#importing modules

import cv2
import numpy as np
import sys
from picamera.array import PiRGBArray
from picamera import PiCamera
old_stdout = sys.stdout

log_file = open("message.log","w")

sys.stdout = log_file



'''#capturing through webcam
cap = cv2.VideoCapture(0)
'''
def color_track(img):

    while(1):

        '''camera = PiCamera()
        rawCapture = PiRGBArray(camera)

        # allow the camera to warmup
        time.sleep(0.1)

        # grab an image from the camera
        camera.capture(rawCapture, format="bgr")
        img = rawCapture.array'''

        #converting frame from bgr to hsv
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

        #red color range
        red_lower=np.array([136,87,111],np.uint8)
        red_upper=np.array([180,255,255],np.uint8)

        #blue color range
        blue_lower=np.array([99,115,150],np.uint8)
        blue_upper=np.array([110,255,255],np.uint8)

        #green color range
        green_lower = np.array([65,60,60],np.uint8)
        green_upper = np.array([80,255,255],np.uint8)


        #finding range of red,blue,green in the image
        red=cv2.inRange(hsv,red_lower,red_upper)
        blue=cv2.inRange(hsv,blue_lower,blue_upper)
        green=cv2.inRange(hsv,green_lower,green_upper)

        #morphological transformation
        kernal = np.ones((5,5),"uint8")

        red=cv2.dilate(red,kernal)
        res=cv2.bitwise_and(img,img,mask=red)

        blue=cv2.dilate(blue,kernal)
        res=cv2.bitwise_and(img,img,mask=blue)

        green=cv2.dilate(green,kernal)
        res=cv2.bitwise_and(img,img,mask=green)

        #Tracking red color

        (_,contours,hierachy)=cv2.findContours(red,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)

        for pic, contour in enumerate(contours):
            area = cv2.contourArea(contour)
            if area>300:
                x,y,w,h = cv2.boundingRect(contour)
                img = cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)
                cv2.putText(img,"RED color",(x,y),cv2.FONT_HERSHEY_SIMPLEX,0.7,(0,0,255))
                print("RED.log")


        #Tracking blue color

        (_,contours,hierachy)=cv2.findContours(blue,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)

        for pic, contour in enumerate(contours):
            area = cv2.contourArea(contour)
            if area>300:
                x,y,w,h = cv2.boundingRect(contour)
                img = cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
                cv2.putText(img,"BLUE color",(x,y),cv2.FONT_HERSHEY_SIMPLEX,0.7,(255,0,0))
                print("BLUE.log")


        #Tracking green color

        (_,contours,hierachy)=cv2.findContours(green,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)

        for pic, contour in enumerate(contours):
            area = cv2.contourArea(contour)
            if area>300:
                x,y,w,h = cv2.boundingRect(contour)
                img = cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,0),2)
                cv2.putText(img,"GREEN color",(x,y),cv2.FONT_HERSHEY_SIMPLEX,0.7,(0,255,0))
                print("GREEN.log")


        cv2.imshow("Color Tracking",img)
        if cv2.waitKey(10) & 0xFF==ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            break



    sys.stdout = old_stdout

    log_file.close()
