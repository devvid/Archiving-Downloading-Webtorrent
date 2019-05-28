module.exports = {


  friendlyName: 'Load archive',

  description: '',

  inputs: {
    id: {
      type: 'string',
      description: 'The id of the archive to view.'
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/view'
    },
  },


  fn: async function (inputs, exits) {

    /**
     * Load the torrent from db
     */
    var archive = await Archives.findOne({id: inputs.id});

    /**
     * Update the vist counter
     */
    await Archives.update({id: archive.id}).set({view_counter: archive.view_counter+1});

    // All done.ratio
    return exits.success({archive: archive});

  }

};