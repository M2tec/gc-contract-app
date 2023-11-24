const generateSC=async () => {
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
`
    return Buffer.from(heliosCode).toString('hex');
}