class SessionBuilder {
    constructor() {}

    createSession(onSuccess = console.log, onFailure = console.error) {
        if (typeof(google) != 'undefined')
            this.createGoogleSession(onSuccess, onFailure);  
        else
            this.createDebugSession(onSuccess, onFailure);
    }

    createGoogleSession(onSuccess = console.log, onFailure = console.error) {
        const sessionInsert = this.insert;
        const sessionGetImageUsage = this.getImageUsage
        const sessionUpdateImageUsage = this.getImageUsage

        this.getSessionId(function(id) {
            onSuccess(new Session(id, sessionInsert, sessionGetImageUsage, sessionUpdateImageUsage))
        }, onFailure);
    }

    createDebugSession(onSuccess = console.log, onFailure = console.error) {
        console.log("Running debug session");
        const debugSessionId = -1;
        const debugInsertFunction = (id, data) => {
            console.log(data);
        };
        const debugGetImageUsage = (imageList, onSuccess) => {
            onSuccess(imageList);
        };
        const debugUpdateImageUsage = (imageList) => {
            console.log(imageList);
        };

        onSuccess(new Session(debugSessionId, debugInsertFunction, debugGetImageUsage, debugUpdateImageUsage));
    }

    getSessionId(onSuccess, onFailure) {
        google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).GetSessionID()
    }

    insert(id, data, onSuccess, onFailure) {
        google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).Insert(id, data)
    }

    getImageUsage(imageList, onSuccess, onFailure) {
        google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).GetImageUsage(imageList)
    }

    updateImageUsage(imageList, onSuccess, onFailure) {
        google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).UpdateImageUsage(imageList)
    }
}
  
class Session {
    id
    insert
    getImageUsage
    updateImageUsage

    constructor(id, insert, getImageUsage, updateImageUsage) {
        this.id = id;
        this.insert = (data) => {
            insert(id, data);
        };
        this.getImageUsage = (imageList, onSuccess) => {
            getImageUsage(imageList, onSuccess);
        };
        this.updateImageUsage = (imageList) => {
            updateImageUsage(imageList);
        };
    }
    
}