export var risetime=0.15 //65536*X seconds. 9.15=10 minutes
export var color=0.02 //Hue of the sunrise 0.02 is a nice sunrise-orange
export var altBrightness = 0.3 //Brightness for alternative mode

export var t0 = time(risetime) //the time() sawtooth counter is not reset when the pattern is modified. We therefore base the pattern off the initial value when the pattern starts.
export var t1=0 //Phase 1 counter. Brightness of the orange part
export var t2=0 //Phase 2 counter. Whiteness for fade to white.

export var t=0 //global time counter 0...1


pinMode(4,INPUT) //alt mode selector switch: 1=Sunrise 0=alternative mode (constant color)

export function beforeRender(delta) {
  t = (1+time(risetime)-t0)%1 //always count from 0 to 1. Caution t0 may be bigger than time()
  t1=max(t1,clamp(2*t,0,1)) //Phase 1 takes the first half of the risetime, so we count at 2x speed
  t2=max(t2,clamp(2*t-1,0,1)) //Phase 2 takes the second half of the risetime, so we count at 2x speed with offset -1 to start exactly when t1 is over. Stick at 1 to avoid looping through multiple sunrises.
}

export function render(index) {
  if(digitalRead(4)||1){
    idx=index/pixelCount
    if(t2==0){
      v=clamp(-1+triangle(idx)+(2*t1),0,1) //The triangle tip rises like the sun. Initial offset: -1 to start with just the tip. Final offset +1 to illuminate everything evenly. Clamp values between 0 and 1 to avoid looping of overflown values.
      hsv(color,1, v)
    }else{
      v=clamp(-1+triangle(idx)+(2*t2),0,1) //Starting with the final phase 1 configuration, decrease saturation for a fade to white.
      hsv(color,1-v, 1)    
    }
  }else{
    hsv(color,1,altBrightness) //alt mode shows constant color
  }
}
