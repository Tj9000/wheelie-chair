import CardReader
from time import sleep


id= CardReader.CardReader()
while True:
    stat,fmt,val=id.readCard()
    #readCard has optional parameters:
    #showImage: default True. if set to false, you will not see optput window
    #drawContours: default is false. set it to true(along with show image) to draw a box around barcode detected
    #eg. readCard(drawContour=True)
    #eg. readCard(showImage=False)
    if stat:
        if fmt=='CODE128':
            #Do your thing
            print fmt,val
        else:
            print "With Some other Format,",fmt,val
        sleep(2)    #use your code, wait for your desired time
    else:
        print val #would be quit
        break
