// Gets the gateway & gasReceiver address for our network
const getGatewayAddress = (network) => {
    switch (network) {
        case 'ethereum': case 'ropsten': return '0xBC6fcce7c5487d43830a219CA6E7B83238B41e71';
        case 'moonbeam': case 'moonbase': return '0x5769D84DD62a6fD969856c75c7D321b84d455929';
        case 'polygon': case 'mumbai': return '0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B';
        case 'avalanche': case 'fuji': return '0xC249632c2D40b9001FE907806902f63038B737Ab';
        case 'fantom': return '0x97837985Ec0494E7b9C71f5D3f9250188477ae14';
        default: return '';
    }
};
const getWDEVAddress = (network) => {
    switch (network) {
        case 'ethereum': case 'ropsten': return '0xDc6B192eFa7eBab24063e20c962E74C88A012D3c';
        case 'moonbeam': case 'moonbase': return '0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715';
        case 'polygon': case 'mumbai': return '0xb6a2f51C219A66866263Cb18DD41EE6C51B464cB';
        case 'avalanche': case 'fuji': return '0xF58537d9061f7257e44442Fb7870A094AAE92B43';
        case 'fantom': return '0xD6f858A1E75e9a06c42dcd86BB876C5E9FccA572';
        default: return '';
    }
}
const gasReceiverAddress = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";

module.exports = { getGatewayAddress, gasReceiverAddress, getWDEVAddress };