
int lightPin = 0; //defines a pin for Photo resistor


void setup() {
  Serial.begin(9600); //begins serial communication
}

void loop() {
  Serial.print (1001); //BOARD ID 
  Serial.print(' ');
  Serial.print(analogRead(lightPin)); //writes value of the photoresistor to the serial monitor.
  delay(1500);
}

