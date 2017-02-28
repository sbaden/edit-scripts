$._ext_PPRO={

	processSubclips : function() {
		// alert("You've successfully clicked!");

		var resBinName = 'Process Clips';
		var searchLocation = app.project.rootItem;
		var resBin = $._ext_PPRO.searchForProjItem(searchLocation, resBinName);  // Bin containing MOV's to subclip

		if (resBin === 0) {
		    alert("There is no 'Process Clips' bin containing clips to subclip");
		}

		var numClips = resBin.children.numItems;

		if (numClips > 0){
		    for (var i = 0; i < numClips; i++){
		        var projectItem = resBin.children[i];
		        
		        if ((projectItem) && (projectItem.type == ProjectItemType.CLIP)){
		            processClip(projectItem);
		        }
		    }
		}
		else { alert("Process Clips folder is empty."); }


		function processClip(projectItem){
		    var markers = projectItem.getMarkers(); 
		    var markerCount = markers.numMarkers;

		    if (markerCount > 0){
		        var previousMarker = 0;
		        var currentMarker;
		        var counter = 0;

		        for(var i = 0; i < markerCount; i++){   // Loop thru markers in a clip
		            if (i === 0){
		                currentMarker = markers.getFirstMarker();
		                counter = i+1;
		                var nextMarker = markers.getNextMarker(currentMarker);
		                
		                addSubClip(projectItem, currentMarker.start, nextMarker.start, counter);
		            }
		            else {
		                currentMarker = markers.getNextMarker(previousMarker);                
		                var nextMarker = markers.getNextMarker(currentMarker);
		                
		                if(nextMarker){
		                    counter = i+1;
		                    
		                    addSubClip(projectItem, currentMarker.start, nextMarker.start, counter);
		                }
		            }

		            if (currentMarker){
		                previousMarker = currentMarker;
		            }
		        }  // End loop thru clip
		    }
		    else { alert("There are no markers in clip: " + projectItem.name + "."); }
		}

		function addSubClip(projectItem, startTimeSeconds, endTimeSeconds, counter) {

		    var hasHardBoundaries      = 1;     //  sets Media Start to original timecode
		    var takeVideo                   = 1;	 // optional, defaulting to 1
		    var takeAudio                   = 1;     //  optional, defaulting to 1

		    var newSubClipName = projectItem.name + '_' + counter;
		    var collectionBinName = projectItem.name + '_collection';
		    var collectionBin = $._ext_PPRO.searchForProjItem(resBin, collectionBinName);  // Bin containing MOV's to subclip
		    
		    if (collectionBin === 0) {
		        collectionBin = resBin.createBin(collectionBinName);
		    }
		    
		    var newSubClip = projectItem.createSubClip(
		        newSubClipName, 
		        startTimeSeconds, 
		        endTimeSeconds, 
		        hasHardBoundaries,
		        takeVideo,
		        takeAudio
		    );
		    
		    newSubClip.moveBin(collectionBin);

		    if (newSubClip){
		        newSubClip.setStartTime(startTimeSeconds); // New in 11.0
		    }
		}
	},



	searchForProjItem : function(searchLocation, itemName) {
	    var numItemsAtRoot = searchLocation.children.numItems;
	    var foundProjItem = 0;
	  
	    for (var i = 0; i < numItemsAtRoot && foundProjItem == 0; i++) {
	        var currentItem = searchLocation.children[i];
	  
	        if (currentItem != null && currentItem.name == itemName) {
	            foundProjItem = currentItem;
	        }
	    }
	    return foundProjItem;
	},
};
