const jsSheet = {
  CreateSession: function(onSuccess, onFailure = console.error) {
    if (typeof(google) != "undefined") {
      google.script.run.withFailureHandler(onFailure).withSuccessHandler(CreateLocalSession).GetSessionID()

      function CreateLocalSession(id) {
        onSuccess({
          id: id,
          insert: function(data) {
            google.script.run.withFailureHandler(onFailure).Insert(id, data)
          },
          getImageUsage: function(imageList, callback) {
            google.script.run.withFailureHandler(onFailure).withSuccessHandler(callback).GetImageUsage(imageList)
          },
          updateImageUsage: function(imageList) {
            google.script.run.withFailureHandler(onFailure).UpdateImageUsage(imageList)
          }
        })
      }
    }
    else {
      console.error("\"google\" not defined: running in debug mode")
      onSuccess({
        id: -1,
        insert: function() {},
        getImageUsage: function(imageList, callback) {
          callback(imageList)
        },
        updateImageUsage: function() {}
      })
    }
  }
}