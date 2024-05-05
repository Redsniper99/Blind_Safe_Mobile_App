from flask import Flask, request
from PIL import Image, ImageFilter, ImageOps
import os
from ultralytics import YOLO
import shutil
import cv2
import easyocr
import subprocess



app = Flask(__name__)
model =YOLO("Medicine_detection.pt")

dataArr = [
  {
    "name": "Frusemide",
    "tablet": 2
    
  },
  {
    "name": "Panadol",
    "tablet": 2
  },
  {
    "name": "Evion",
    "tablet": 1
  }
]

@app.route('/medicine-detection', methods=['POST'])
def index():                    
    cap = cv2.VideoCapture(0)

    while (True):
        ret, frame = cap.read()

        model.predict(source=frame, show=True, conf=0.5,save=True, save_crop=True)

        directorypath = "./runs/detect/predict"
        isavailable =  os.listdir(directorypath)
        print("helloo")

        vao =0
        for filename in isavailable:
            print(filename)
            if (filename == "crops"):
                newpath = "./runs/detect/predict/crops"
                isavailables =  os.listdir(newpath)
                
                print(isavailables[0])
                if(isavailables[0]=="mc_front"):
                        mediFront()
                elif("mc_back"):
                        mediBack()
                vao =1
                break
            else:
                print("au----------------------------------")

        if(vao ==1):
            break
        
        print("effefef----------------------------------")


    cap.release()


    directory_path = './runs/detect/predict'
    # Attempt to delete the directory
    try:
        shutil.rmtree(directory_path)
        print(f"Directory '{directory_path}' and its contents successfully deleted.")
    except OSError as e:
        print(f"Error: {directory_path} : {e.strerror}")




    cv2.destroyAllWindows()


def mediBack():

          image_directory = './runs/detect/predict/crops/mc_back'
          files = os.listdir(image_directory)
          image_files = [file for file in files if file.endswith(('.jpg', '.jpeg', '.png', '.gif'))]

          mediCard=[]
          if not image_files:
                    print("No image files found in the directory.")
          else:
                    img1_path = os.path.join(image_directory, image_files[0])
                    img1 = Image.open(img1_path)
                    reader = easyocr.Reader(['en'], gpu=True)
                    text_ =reader.readtext(img1)
                    threshold = 0.25

                    for t in text_ :
                              # print(t)
                              bbox, text ,score = t
          
                              mediCard.append(text)
          

                    img1.show()
          
          print(mediCard)

          if(len(mediCard) > 0):

                    res = []
                    for item in dataArr:
                              # print(item['name'])
                              for predi in mediCard:
                                        if(item['name'] in predi):
                                                  #       print(predi)
                                                  res.append(item['name'])
                                                  break 
                                        
                              if(len(res)>0):
                                        break



                    if(len(res)>0):
                            print(res[0])

                            detect=0

                            for data in dataArr:
                                        if(data['name'] ==res[0]):
                                                print(data['name'])
                                                detect =2
                                                text_to_speak = f"This is ,{data['name']} ,,  Take {data['tablet']} tablets of this"
                                                subprocess.call(['say', text_to_speak])

                            if(detect == 0):
                                    text_to_speak = f"Not detected, Please try again"
                                    subprocess.call(['say', text_to_speak])

                    else:
                            text_to_speak = f"Not detected, Please try again"
                            subprocess.call(['say', text_to_speak])





def mediFront():
        text_to_speak = f"Please turn over the medication card and try again."
        subprocess.call(['say', text_to_speak])
        
        
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)