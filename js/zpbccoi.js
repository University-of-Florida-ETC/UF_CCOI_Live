var observationSets=new Object();
var derServer='https://ccoi-dev.education.ufl.edu/';

function GetAjaxReturnObject(mimetype){
	var xmlHttp=null;
	if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		xmlHttp = new XMLHttpRequest();
		if (xmlHttp.overrideMimeType) {xmlHttp.overrideMimeType(mimetype);}
	} else if (window.ActiveXObject) { // IE
		try {xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");}catch (e) {try {xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");}catch (e) {}}
	}
	return xmlHttp;
}

function getHTML(httpRequest) {
	if (httpRequest.readyState===4) {
		if (httpRequest.status === 200) {			// if buggy, check logs for firefox / OPTIONS instead of POST -- need same domain
			 return httpRequest.responseText;
		}
	}
}

/*
function switchPlayState(){
	viewingPlaygrounds=!viewingPlaygrounds; // switch true/false
	if(viewingPlaygrounds){leftAndRight.className=origLeftAndRightClass+' playground';}else{leftAndRight.className=origLeftAndRightClass;}
	showObservationSets();
}
*/

function fetchUserObSets2(u){
	//if(	! ((Object.keys(appVideoList).length>0) && (Object.keys(appPathList).length>0)) ){console.log('not ready to load... try again in half a sec'); setTimeout(function(){ fetchUserObSets2(userid);},500);return;}		// if we're not ready -- wait half a second and try again.
	var xmlHttp=GetAjaxReturnObject('text/html');if (xmlHttp==null) {alert ("Your browser does not support AJAX!");return;}
	xmlHttp.onreadystatechange = function() {
		var data=getHTML(xmlHttp);
		if(data){
			observationSets=JSON.parse(data);
            console.log("The observation sets are:");
            console.log(observationSets);

			let researchList = document.getElementById("research_obsset_list");
			for(var obsSet in observationSets['research']){
				appendSessionLink2(researchList, obsSet, observationSets['research'][obsSet].name);
			}

			let playgroundsList = document.getElementById("playgrounds_obsset_list");
			for(var obsSet in observationSets['playgrounds']){
				appendSessionLink2(playgroundsList, obsSet, observationSets['playgrounds'][obsSet].name);
			}
		}
	}
	sendStr='uid2='+u;
	var url =  encodeURI(derServer+'api/ccoi_ajax.php?'+sendStr);			console.log(url);
	xmlHttp.open('GET', url, true);xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');xmlHttp.send(sendStr);
}

function appendSessionLink2(container, i, name) {
    if(name == null) {
		/*
        if (session.videoURL != null) {
            // If name not explicitly set, use video title
            name = session.videoURL.replace(/\.[^/.]+$/, "");
            name += " ("+session.observer+")";
        }
        else {*/
            name = "Session "+i;
        //}
    }
    let template = `
        <div class="row">
            <div class="col-sm-9 col-12">
                <a id="session_${i}_name" class="btn-link session-edit" href="#" data-index="${i}">${name}</a>
            </div>
            <div class="col-sm-3 col-12">
                <a class="btn-link session-edit" href="ZPB/observation?isPlayground=1&id=${i}" data-index="${i}"><span class="oi oi-pencil px-2" title="Edit Session" aria-hidden="true"></span></a>
                <a class="btn-link" href="ZPB/observation?isPlayground=1&id=${i}" data-index="${i}"><span class="oi oi-trash px-2" title="Delete Session" aria-hidden="true"></span></a>
                <a class="btn-link" href="/visualizations?session=${i}"><span class="oi oi-pie-chart px-2" title="View Visualizations" aria-hidden="true"></span></a>
            </div>
        </div>
    `;
    let wrapper = document.createElement("LI");
    wrapper.classList.add('session-listing');
    wrapper.classList.add('my-2');
	wrapper.innerHTML = template;
	container.appendChild(wrapper);
}

function fetchUserObSets3(u){
	//if(	! ((Object.keys(appVideoList).length>0) && (Object.keys(appPathList).length>0)) ){console.log('not ready to load... try again in half a sec'); setTimeout(function(){ fetchUserObSets2(userid);},500);return;}		// if we're not ready -- wait half a second and try again.
	var xmlHttp=GetAjaxReturnObject('text/html');if (xmlHttp==null) {alert ("Your browser does not support AJAX!");return;}
	xmlHttp.onreadystatechange = function() {
		var data=getHTML(xmlHttp);
		if(data){
			observationSets=JSON.parse(data);
            console.log("The observation sets are:");
            console.log(observationSets);

			let params = new URLSearchParams(document.location.search);
			let id = params.get("id");
			let isPlayground = params.get("isPlayground");
			let playorreal = isPlayground ? 'playgrounds' : 'research';


			if(observationSets[playorreal][id]){
				let currentObsSet = observationSets[playorreal][id];
				if(currentObsSet.name){
					document.getElementById("obsSetTitle").innerText = currentObsSet.name + (isPlayground ? " (Playground)" : " (Research)");
					document.getElementById("obsset_title").value = currentObsSet.name;
				}
				if(currentObsSet.studentID){
					document.getElementById("studentID").value= currentObsSet.studentID;
				}
				if(currentObsSet.placetime){
					document.getElementById("obsset_date").value = currentObsSet.placetime;
				}
				if(currentObsSet.videoURL){
					document.getElementById("session_video_title").value = currentObsSet.videoURL;
				}
				if(currentObsSet.notes){
					document.getElementById("obsset_notes").value = currentObsSet.notes;
				}
				if(currentObsSet.observations){
					if(currentObsSet.observations.length > 0){
						let destination = document.getElementById("path_list");
						currentObsSet.observations.forEach((element, index) => {
							let obsHTML = `<div class="path-listing-container">
							<h5 data-index="${index}" class="path-listing-header">${element.name}
								<a class="btn-link path-edit-icon" href="#" data-index="0"><span class="oi oi-pencil px-3" title="Edit Path" aria-hidden="true"></span></a>
								<a class="btn-link path-delete-icon" href="#" data-index="0"><span class="oi oi-trash" title="Delete Path" aria-hidden="true"></span></a>
								<button class="btn-link float-right path-dropdown-btn collapsed" data-toggle="collapse" data-target="#path_drop_0" aria-expanded="false"><span class="oi oi-chevron-bottom" title="Show Observation Nodes" aria-hidden="true"></span></button>
							</h5>
							<ol class="collapse" id="path_drop_${index}" style="">`;
							element.ObResp.forEach(obRespObject => {
								let minutes = parseInt(obRespObject.seconds) / 60;
								let seconds = ("0" + (parseInt(obRespObject.seconds) % 60)).slice(-2);
								let notes = "";
								if(obRespObject.notes){
									notes = " ["+obRespObject.notes+"]";
								}
								obsHTML+=`
								<li>(${minutes}:${seconds}) ${ObRespObject.PNid}-${ObRespObject.SAid}: This is where the decoded name will go${notes}</li>`
							});
							obsHtml += `
								</ol>
							</div>`;
							destination.innerHTML += obsHTML;
						});
					}
				}
			}
			else
				notAllowedInEditor();
		}
	}
	sendStr='uid2='+u;
	var url =  encodeURI(derServer+'api/ccoi_ajax.php?'+sendStr);			console.log(url);
	xmlHttp.open('GET', url, true);xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');xmlHttp.send(sendStr);
}

function notAllowedInEditor() {
	console.log("You would have been kicked out here!");
}

/*
function showObservationSets(){
	leftSide.style.opacity=0;
	leftInnerContainer.innerHTML='';			// wipe out all existing child nodes
	currentlyLoadedObservation=0;
	currentlyLoadedObservationSet=0;
	header_usersets.innerText='';
	header_obsetmeta.innerHTML='';
	header_obsetmeta.style.display='none';
	maybe_videolink.innerHTML='';		maybe_videolink.style.display='none';
	header_highlevelnotes.style.display='none';
	var maybeplayground='switch to the playground';		var settext=' Observation Sets';
		if(viewingPlaygrounds){maybeplayground='switch to research'; settext=' Playground Sets';}
	
	if(jsUserVars['first'].substring(-1)=='s'){apposS="'";}else{apposS="'s";}
	header_loadedobsset.innerText=jsUserVars['first']+apposS+settext;
	header_loadedobsset.className='orange';
		header_loadedobs.className='';
	header_loadedobs.innerText='';
	header_loadedobsxofx.innerHTML='Select an observation set to view or edit the set or <span id="playstate" onClick="switchPlayState();">'+maybeplayground+'</span>';
	for (var e in observationSets){
		if( ( !viewingPlaygrounds && observationSets[e]['isPlayground']==0) || (viewingPlaygrounds && observationSets[e]['isPlayground']==1)){
			var newNode=platonicObsSet.cloneNode(true);
				newNode.childNodes[0].innerText=observationSets[e]['name'];
					newNode.setAttribute('title','Path: '+appPathList[observationSets[e]['path']]['name']);		// this is getting called before the AJAX has time to reply with the data... reordered the loading calls
				newNode.id='obSet_'+e;
				newNode.addEventListener('click',function(e){loadObservationSet(e);e.stopPropagation();},false);
				newNode.lastChild.children[0].addEventListener('click',function(e){singleEdit(e);e.stopPropagation();},false);		// rename
					newNode.lastChild.children[0].setAttribute('opitem','name');
				newNode.lastChild.children[1].addEventListener('click',function(e){if(confirm("\nDELETING OBSERVATION SET\n===================================\n\nYou are about to delete an existing Observation Set.\nAre you sure about this?\n\n===================================\n")){nukeObSet(e);}e.stopPropagation();},false);	// nuke
				newNode.lastChild.children[2].addEventListener('click',function(e){visualize(e);e.stopPropagation();},false);		// visualize
			leftInnerContainer.appendChild(newNode);
		}
	}
	// CREATE NEW at bottom =========
	var newNode=platonicObsSet.cloneNode(true);
	newNode.childNodes[0].innerText='Create New Observation Set';
		newNode.id='obSet_0';		newNode.setAttribute('opitem','dopath');
		newNode.removeChild(newNode.lastChild);
		newNode.addEventListener('click',function(e){doDrop(e);e.stopPropagation();},true);
	leftInnerContainer.appendChild(newNode);
	fadeInLS();
	
}
*/