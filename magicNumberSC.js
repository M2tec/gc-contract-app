const generateSC=async (number=42)=>{
    const Buffer = (await import("https://cdn.skypack.dev/buffer@6.0.3")).default.Buffer;                        
    const heliosCode= `
spending MagicNumber

struct Datum {
    magicNumber: Int
}

struct Redeemer {
    magicNumber: Int 
}

func main(datum: Datum, redeemer: Redeemer, _) -> Bool {   
    redeemer.magicNumber==datum.magicNumber
}    

const EXAMPLE_DATUM :Datum = Datum{
    magicNumber:${number}
}

`
    return Buffer.from(heliosCode).toString('hex');
}