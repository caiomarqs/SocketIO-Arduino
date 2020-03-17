const int pwmPin = 9;

void setup()
{
  Serial.begin(9600);
  pinMode(pwmPin, OUTPUT);
  analogWrite(pwmPin, 0);
}
String inString = "";
void loop(){
  while(Serial.available() > 0){     
    int inChar = Serial.read();
 
    if(isDigit(inChar)) {
      inString += (char)inChar;
    }
    if (inChar == '\n') {
      //Serial.print("Value:");
      //Serial.print(inString.toInt());
      //Serial.print(" | String: ");
      //Serial.println(inString);

      int sliderValue = inString.toInt();

      int ledValue = map(sliderValue, 1, 100, 0, 255);

      if(ledValue >= 230){
        ledValue = 230;
      }
      
      analogWrite(pwmPin, ledValue);
      inString = "";
    }
  }
  delay(50);
}
