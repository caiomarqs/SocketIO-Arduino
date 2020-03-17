const int pinPotentiometer = A0;

int potentiometerValue, dataMap = 0;
 
void setup(){
   pinMode(pinPotentiometer, INPUT);
   Serial.begin(9600);
}

void loop(){
  potentiometerValue = analogRead(pinPotentiometer);
  dataMap = map(potentiometerValue, 0, 1023, 0, 255);

  //prinln, in js program the parser limiter is active by /n
  Serial.println(potentiometerValue);

  delay(10);
}
