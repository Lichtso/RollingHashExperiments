function RollingHash(base, modulo, windowLength) {
    let value, windowBuffer, indexInWindow, outFactor = 1;
    for(let i = 1; i < windowLength; ++i)
        outFactor = (outFactor*base)%modulo;
    this.push = function(element) {
        value += (modulo*outFactor-windowBuffer[indexInWindow])*outFactor;
        windowBuffer[indexInWindow] = element;
        indexInWindow = (indexInWindow+1)%windowLength;
        value = (value*base+element)%modulo;
        return value;
    };
    this.reset = function() {
        value = 0;
        windowBuffer = new Array(windowLength).fill(0);
        indexInWindow = 0;
    };
    this.reset();
}

String.prototype.hashCode = function() {
    let result = 0x811C9DC5;
    for(let i = 0, l = this.length; i < l; ++i) {
        result ^= this.charCodeAt(i);
        result += (result<<1)+(result<<4)+(result<<7)+(result<<8)+(result<<24);
    }
    return result>>>0;
};

function generateChunk(view, text) {
    const hashValue = text.hashCode(),
          hashHex = ('0000000'+hashValue.toString(16)).substr(-8).toUpperCase();
    const element = document.createElement('pre');
    element.setAttribute('style', 'background-color: #'+hashHex.substr(-6));
    element.setAttribute('title', '0x'+hashHex);
    element.innerText = text;
    view.appendChild(element);
    return element;
}
