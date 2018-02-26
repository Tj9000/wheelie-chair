int count,waittime,t;
String str,uname,pw;
char dir;
int steps;
String inputString = "";         // a String to hold incoming data
boolean stringComplete = false;  // whether the string is complete


const int wheelPinR1 = 5; //M2-IN L
const int wheelPinR2 = 4; //M2-IN R
const int wheelPinL1 = 3; //M1-IN L
const int wheelPinL2 = 2; //M1-IN R
const int trigPin = 11;
const int echoPin = 10;

void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  inputString.reserve(200);

  pinMode(wheelPinL1,OUTPUT);
  pinMode(wheelPinL2,OUTPUT);
  pinMode(wheelPinR1,OUTPUT);
  pinMode(wheelPinR2,OUTPUT);

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
}

int getProximityFront(){  //12-15 ms delay
  long duration;
  int distance;
  digitalWrite(trigPin, LOW);
  delay(10);

// Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH); // Reads the echoPin, returns the sound wave travel time in microseconds
  distance= duration*0.034/2; // Calculating the distance
  //Serial.print("duration: ");
  //Serial.println(duration);
  return(distance);
}
void delay_TjF(unsigned long steps){
  unsigned long count=steps*100/11;  //delay in proximity=5ms
  int dist;
  char ch;
  while(count>0){
    dist=getProximityFront();
    if(dist < 5){
      Serial.print("Too Close at step ");
      Serial.print(count*6/100,DEC);
      Serial.print(", Dist= ");
      Serial.println(dist,DEC);
      return;
    }
    ch=Serial.peek();
    if( ch=='S' || ch=='F' || ch=='B' ||ch=='L' ||ch=='R'  ){
      Serial.print("Peek val: ");
      Serial.println(ch);
      return;
    }
    count--;
  }
}

void delay_Tj(unsigned long steps){
  unsigned long count=steps*10/1.1;
  while(count>0){
    delay(10);
    if(Serial.peek() != -1 ){
      Serial.print("Peek val: ");
      Serial.println(Serial.peek());
      return;
    }
    count--;
  }
}

void ledAction(int n,int d=0){
  for(int i=0;i<n;++i){
    digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
    delay(200);
    digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
    delay(200);
  }
  delay(d*1000);
}

void abcd(int c=0,int w=0){
//    count=Serial.parseInt();
//    waittime=Serial.parseInt();
    
    ledAction(c,w);
    Serial.print(c,DEC);
    Serial.print("..");
    Serial.print(w,DEC);
    
    Serial.println("Done");
}
void wheel(char L, char R){
  if(L=='F'){
    digitalWrite(wheelPinL1,HIGH);
    digitalWrite(wheelPinL2,LOW);
  }
  else if (L=='B'){
    digitalWrite(wheelPinL1,LOW);
    digitalWrite(wheelPinL2,HIGH);
  }
  else if (L=='S'){
    digitalWrite(wheelPinL1,LOW);
    digitalWrite(wheelPinL2,LOW);
  }
  
  if(R=='F'){
    digitalWrite(wheelPinR1,HIGH);
    digitalWrite(wheelPinR2,LOW);
  }
  else if (R=='B'){
    digitalWrite(wheelPinR1,LOW);
    digitalWrite(wheelPinR2,HIGH);
  }
  else if (R=='S'){
    digitalWrite(wheelPinR1,LOW);
    digitalWrite(wheelPinR2,LOW);
  }
  
}
void MoveCar(char dir,int steps){
  if(dir!='S' && steps==0)
    Serial.println("Didn't recognize input format");
  else
    switch(dir){
      case 'F':
          wheel('F','F');
          delay_TjF(steps);
          wheel('S','S');
        break;
      case 'B':
          wheel('B','B');
          delay_Tj(steps);
          wheel('S','S');
        break;
      case 'L':
          wheel('S','F');
          delay_Tj(steps);
          wheel('S','S');
        break;
      case 'R':
          wheel('F','S');
          delay_Tj(steps);
          wheel('S','S');
        break;
       case 'S':
          wheel('S','S');
          break;
      default:
          wheel('S','S');
        Serial.println("Didn't recognize input format");
        break;
  }
}
void StartAction(){
  Serial.println("Welcome");
  while(1){
    while(Serial.available() > 0 ){
      str=String(Serial.readString());
      Serial.println(str);
      if(str=="exit")
        return;
      dir=str.charAt(0);
      str.remove(0,1);
      steps=str.toInt();
      Serial.print("dir: ");
      Serial.print(dir);
      Serial.print("    Steps: ");
      Serial.println(steps,DEC);

      MoveCar(dir,steps);
    }
  }
}
// the loop function runs over and over again forever
void loop() {
  while(Serial.available() > 0 ){
    uname=String(Serial.readString());
    Serial.println(uname);
    if(uname=="InitCarASSTauth00010"){
      StartAction();
    }
    else if(uname=="Tj"){
      Serial.println(uname+", Enter Cred: ");
      while(!Serial.available());
      pw=String(Serial.readString());
      if(pw=="car")
        StartAction();
      else
        Serial.println("Incorrect Pw");
    }
    else if(uname.startsWith("LED")){
      uname.remove(0,4);
      t=uname.indexOf(',');
      count=(uname.substring(0,t)).toInt();
      waittime=(uname.substring(t+1)).toInt();
      abcd(count,waittime);
    }
  }
}
