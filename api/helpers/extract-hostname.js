module.exports = {


  friendlyName: 'Extract hostname',


  description: '',


  inputs: {
    url: {
      type: 'string'
    }
  },



  fn: async function (inputs, exits) {
    var hostname;
    var url = inputs.url;
    
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("//") > -1) 
    hostname = url.split('/')[2]; 
    else hostname = url.split('/')[0];
    
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return exits.success(hostname);
  
  }


};

