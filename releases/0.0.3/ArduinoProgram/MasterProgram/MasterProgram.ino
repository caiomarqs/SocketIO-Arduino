const int pwmPin = 9;
const int pinPotentiometer = A0;

void setup(){
  Serial.begin(9600);
  pinMode(pwmPin, OUTPUT);
  analogWrite(pwmPin, 0);

  pinMode(pinPotentiometer, INPUT);
}

String inString = "";
int potentiometerValue, dataMap = 0;
void loop(){
  while(Serial.available() > 0){     
    //Led
    int inChar = Serial.read();
 
    if(isDigit(inChar)) {
      inString += (char)inChar;
    }
    if (inChar == '\n') {
      int sliderValue = inString.toInt();
      int ledValue = map(sliderValue, 0, 100, 0, 255);
      if(ledValue >= 240){
        ledValue = 240;
      }
      analogWrite(pwmPin, ledValue);
      inString = "";
    }
  }


  potentiometerValue = analogRead(pinPotentiometer);
  dataMap = map(potentiometerValue, 0, 1023, 0, 255);
  //prinln, in js program the parser limiter is active by /n
  Serial.println(potentiometerValue);
  delay(50);
}
