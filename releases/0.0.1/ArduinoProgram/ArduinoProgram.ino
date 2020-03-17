const int pinoPotenciometro = A0;

int potenciometroValor, dataMap = 0;
 
void setup(){
   pinMode(pinoPotenciometro, INPUT);
   Serial.begin(9600);
}

void loop(){
  potenciometroValor = analogRead(pinoPotenciometro);
  dataMap = map(potenciometroValor, 0, 1023, 0, 255);

  //prinln, in js program the parser limiter is active by /n
  Serial.println(potenciometroValor);

  delay(10);
}
