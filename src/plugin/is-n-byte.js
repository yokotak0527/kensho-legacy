export default (Kensho)=>{

    let isNbyte = function(half){
        return function(val){
            let code = val.charCodeAt(0);
            let f    = (code >= 0x0 && code < 0x81) || (code == 0xf8f0) || (code >= 0xff61 && code < 0xffa0) || (code >= 0xf8f1 && code < 0xf8f4);
            return !(f ^ half);
        }
    }
    Kensho.plugin.add('is1byte', isNbyte(true));
    Kensho.plugin.add('is2byte', isNbyte(false));
};
