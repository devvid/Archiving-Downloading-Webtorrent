module.exports = {


  friendlyName: 'View home',


  description: 'Display "Home" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/home'
    }

  },


  fn: async function () {

    /**
     * Load the most popular archives
     */
    var popular_archives = await Archives.find({
      sort: 'view_counter DESC',
      limit: 10
    });

    /**
     * Load the most recent archives
     */
    const recent_archives = await Archives.find({
      sort: 'createdAt DESC',
      limit: 10
    });
    

    /**
     * Shows popular items based on user views. 
     * Removes duplicated urls from showing on the home page.
     * eg. If the item was currently added then it wont show in the popular tab.
     */
    for(var i = 0; i < popular_archives.length; i++)
      for (var x = 0; x < recent_archives.length; x++)
        if (popular_archives[i] != null) 
        if (popular_archives[i].id == recent_archives[x].id) popular_archives[i] = null;
        //popular_archives.splice(i,1);
    const flag_contains = 0;
    for(var i = 0; i < popular_archives.length; i++)
      if(popular_archives[i] != null) flag_contains++; 
    if(flag_contains == 0) popular_archives = null;

    console.log(popular_archives)
    // Respond with view.
    return {popular_archives: popular_archives, recent_archives: recent_archives, version: sails.config.custom.softwareVersionNumber};

  }

};