# import the necessary packages
from picamera.array import PiRGBArray
import picamera
import time
import cv2
import zbar
from PIL import Image
import simple_barcode_detection

class CardReader:
    def __init__(self,vflip=True,hflip=True):
        # initialize the camera and grab a reference to the raw camera capture
        self.camera = picamera.PiCamera()
        self.camera.resolution = (1024, 768)
        self.camera.framerate = 16
        self.camera.vflip = vflip
        self.camera.hflip = hflip
        self.rawCapture = PiRGBArray(self.camera, size=(1024, 768))
        # allow the camera to warmup
        time.sleep(0.1)
        self.scanner = zbar.ImageScanner()
        self.scanner.parse_config('enable')
    
    def readCard(self,showImage=True,drawContour=False):
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
                if(drawContour and showImage):
                    box = simple_barcode_detection.detect(image)
                    cv2.drawContours(image, [box], -1, (0, 255, 0), 2)
                if(showImage):
                    cv2.imshow("Frame", image)
                    key = cv2.waitKey(1)  & 0xFF  #for 64 bit
                    if key == ord('q'):
                        return(False,'Quit','Quit')
                
                #Check Barcode
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY, dstCn=0) #image means frame
                pil = Image.fromarray(gray)
                width, height = pil.size
                raw = pil.tobytes()
                img = zbar.Image(width, height, 'Y800', raw)
                self.scanner.scan(img)
                for symbol in img:
                    # do something useful with results
                    #print 'decoded', symbol.type, 'symbol', '"%s"' % symbol.data
                    if showImage:
                        if str(symbol.type) == 'CODE128':
                            color=(0,255,0) #green
                        else:
                            color=(255,0,0) #red
                        cv2.rectangle(image,(0,0),(1024,768),color,5)
                        cv2.imshow("Frame", image)
                        cv2.waitKey(1)
                    return (True,str(symbol.type),str(symbol.data))
                # clear the stream in preparation for the next frame
                self.rawCapture.truncate(0)
        finally:
            #cv2.destroyAllWindows()
            pass
        return(False,'Quit','Quit')
