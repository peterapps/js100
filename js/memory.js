class Memory {
    constructor(){
        this.data = new Array(16384);
        this.drivers = new Array(260);
        for (var i = 0; i < 260; ++i) this.drivers[i] = 0;
        for (var i = 0; i < mif.length; ++i) this.data[i] = mif[i];
        for (var i = mif.length; i < 16384; ++i) this.data[i] = 0;

        return new Proxy(this, {
            get: (obj, key) => {
                if (typeof(key) === 'string' && (Number.isInteger(Number(key)))){
                    return (key < 0x80000000) ? obj.data[key] : obj.drivers[key-0x80000000];
                } else {
                    return obj[key];
                }
            },
            set: (obj, key, value) => {
                if (typeof(key) === 'string' && (Number.isInteger(Number(key)))){
                    return (key < 0x80000000) ? (obj.data[key] = value) : (obj.drivers[key-0x80000000] = value);
                } else {
                    return obj[key] = value;
                }
            }
        });
    }
};

var memory = false;

function handleLoad(){
    memory = new Memory();
    message("Loaded into memory.");
}