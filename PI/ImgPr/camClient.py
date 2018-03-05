# import the necessary packages
from picamera.array import PiRGBArray
import picamera
import time
import cv2
from PIL import Image
import threading
import contour_pi

class ImageReader(threading.Thread):
    def __init__(self,vflip=True,hflip=True):
        # initialize the camera and grab a reference to the raw camera capture
        threading.Thread.__init__(self)
        self.camera = picamera.PiCamera()
        self.camera.resolution = (1024, 768)
        self.camera.framerate = 16
        self.camera.vflip = vflip
        self.camera.hflip = hflip
        self.rawCapture = PiRGBArray(self.camera, size=(1024, 768))
        # allow the camera to warmup
        time.sleep(0.1)
    
    def show(self,showImage=True,drawContour=False):
        self.showImage=showImage
        self.drawContour=drawContour
        self.camClientOn=True
        self.start()
    def stop():
        self.camClientOn=False
    def run():
        # capture frames from the camera
        key=0
        #cv2.namedWindow("Frame")
        # clear the stream in preparation for the next frame
        self.rawCapture.truncate(0)
        try:
            for frame in self.camera.capture_continuous(self.rawCapture, format="bgr", use_video_port=True):
                # grab the raw NumPy array representing the image, then initialize the timestamp
                # and occupied/unoccupied text
                image = frame.array.copy()
                
                # show the frame
                if(self.drawContour and self.showImage):
                    if not contour_pi(image):
                        break
                elif(self.showImage):
                    cv2.imshow("Frame", image)
                    key = cv2.waitKey(1)  & 0xFF  #for 64 bit
                    if key == ord('q'):
                        return(False,'Quit','Quit')
                if not self.camClientOn:
                    break
                # clear the stream in preparation for the next frame
                self.rawCapture.truncate(0)
        finally:
            #cv2.destroyAllWindows()
            pass
        # return(False,'Quit','Quit')
