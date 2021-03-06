__app.modules.userhome = function() {
	var $profileAvatar = $('#profile_avatar');
	var $gravatarEmailWrapper = $('#gravatar-email-wrapper');
	var $gravatarEmail = $('#gravatar-email');
	var $inboxCount = $('#inbox-count');
	var $peopleSearch = $('#people-search');
	var $peopleResult = $('#people-result');
	var $profileAvatar = $('#profile_avatar');
	var $profileBox = $('#profile-box');
	var $gravatarInfobox = $('#gravatar-infobox');

	var $actionsHolder = $('#actionsHolder');
	var $sideMenuDiv = $('#side_menu');
	var $instSearchWrapper = $('#inst_search_wrapper');
	var $instSearch = $('#inst_search');
	var $instHolder = $('#inst_holder');
	var $instAddButton = $('#add-inst');
	var $fayeConnectionIndicator = $('#faye-connection-indicator');

	var $bioEditWrapper = $('#bio-edit-wrapper');
	var $bioInput = $('#bio-input');
	var $bio = $('.bio');
	var $bioEditToggle = $('#edit-bio');
	var $bioEditSubmit = $('#edit-bio-submit');
	var $bioInputToggle = $('#bio-input-toggle');


	var _userID = __app.sharedVariables.userID;
	var _fayeClient = null;
	var _fayeSub = null;

	var _people_result = new Array();
	var _previous_search = "";

	var _snd = new Audio("/assets/sound1.mp3");
	var _showdown = new Showdown.converter();

	var _userAction = function() {
		var actions = {};
		var $actionsHolder = $('#actionsHolder');

		var fayeMessageHandler = function(data) {
			console.log("FayeMessageHandler::Data::UserAction", data);
			_snd.play();
			$(data.html).prependTo($actionsHolder).hide().slideDown();
			actions[data.id] = $('#user-action-'+data.id);
		};

		$('.user-action').each(function() {
			var id = $(this).data('id');
			actions[id] = $(this);
		});

		return {
			'fayeMessageHandler': fayeMessageHandler
		};

	}();


	$profileAvatar.on('click', click_profileAvatar);
	$gravatarEmail.on('blur', statechange_gravatar_normal);
	$gravatarEmail.on('change', change_gravatarEmail);
	$gravatarEmail.on('keyup', keyup_gravatarEmail);

	$peopleSearch.on('keydown', keydown_peopleSearch);
	$peopleSearch.on('keyup', keyup_peopleSearch);
	$peopleSearch.on('blur', blur_peopleSearch);

	$instSearch.on('keyup', keyup_instSearch);
	$instSearch.on('keydown', keydown_instSearch);

	updatePeopleSearchResult();

	connectFaye();

	$('.presult').live('click', function(e) {
		var id = $(this).attr('data-id');
		window.location = "/users/"+id;
	});
	$('.presult').live('mouseenter', function() {
		$('.presult').removeClass('selected');
		$(this).addClass('selected');
	});

	$('.inst').live('click', function() {
		$(this).remove();
		$.getJSON('/user/remove_inst_rel', {'inst_id': ($(this).attr('id').split("-")[1])}, function(data) {
			console.log(data);
		});
	});

	$('.inst').live('mouseenter', function() {
		$(this).find('.inst-icon').removeClass('fa-university');
		$(this).find('.inst-icon').addClass('fa-times');
	});
	$('.inst').live('mouseleave', function() {
		$(this).find('.inst-icon').removeClass('fa-times');
		$(this).find('.inst-icon').addClass('fa-university');
	});

	$profileBox.hover(function() {
		$(this).find('.opt').animate({opacity: 1.0}, 200);
	}, function() {
		$(this).find('.opt').animate({opacity: 0.1}, 200);
	});


	$instAddButton.click(show_instSearch);
	$instSearch.blur(hide_instSearch);

	updateInputSize($bioInput);
	$bioInput.on('keyup', function() {
		updateInputSize($(this));
		$bio.html(_showdown.makeHtml($(this).val()));
	});
	$bioEditToggle.click(function() {
		if($bioEditWrapper.is(':visible')) {
			$bioEditWrapper.slideUp("fast");
			$actionsHolder.slideDown("fast");
		} else {
			$bioEditWrapper.slideDown("fast");
			$actionsHolder.slideUp("fast");
			var toggleTop = $bioEditToggle.offset().top;
			var wrapperTop = $bioInput.offset().top;
			console.log('toggleTop', toggleTop);
			console.log('wrapperTop', wrapperTop);
			if(wrapperTop > toggleTop) {
				window.scrollTo(0, wrapperTop);	
			}
			$bioInput.focus();
		}
	});
	$bioInputToggle.click(function() {
		if($bioInput.is(':visible')) {
			$bioInput.slideUp("fast");
		} else {
			$bioInput.slideDown("fast");
		}
	});
	$bioEditSubmit.click(function() {
		var mdown = $bioInput.val();
		$.post('/user/update_bio', {'markdown': mdown}, function(data) {
			console.log(data);
		});
		$bioEditToggle.click();
	});

	function show_instSearch(e) {
		$instSearchWrapper.show();
		$instSearch.show().focus();
		$instAddButton.hide();
		$peopleSearch.hide();
		$sideMenuDiv.hide();
	}

	function hide_instSearch(e) {
		$instSearch.val("");
		$instSearchWrapper.slideUp();
		$instAddButton.show();
		$peopleSearch.show();
		$sideMenuDiv.show();
	}

	function keydown_instSearch(e) {
		if(($(this).val() == "" && e.keyCode == 8)|| e.keyCode == 27) {
			hide_instSearch();	
		}
	}
	function keyup_instSearch(e) {
		if(e.keyCode != 13) {return;}
		$.getJSON('/user/add_inst_rel', {'name':$(this).val()}, function(data) {
			console.log(data);
			if(data.ok) {
				if($('#inst-'+data.inst_id).length === 0) {
					$instHolder.prepend("<span class='label label-info inst' id='inst-"+data.inst_id+"' title='Remove'><i class='fa fa-fw fa-university inst-icon'></i> "+data.inst_name+"</span>");
				}
			}
			hide_instSearch();
		});
	}

	function hide_peopleSearch(e) {
		$peopleResult.hide();
		$sideMenuDiv.slideDown();
	}
	function blur_peopleSearch(e) {
		$peopleSearch.val("");
		setTimeout(hide_peopleSearch, 200);
	}
	function keydown_peopleSearch(e) {
		if(e.keyCode === 40) {
			var next = $('.presult.selected').next(".presult");
			$('.presult').removeClass('selected');
			if(next.length > 0) {
				next.addClass('selected');
			} else {
				$('.presult:first').addClass('selected');
			}
		}
		else
		if(e.keyCode === 38) {
			var prev = $('.presult.selected').prev(".presult");
			$('.presult').removeClass('selected');
			if(prev.length > 0) {
				prev.addClass('selected');
			} else {
				$('.presult:last').addClass('selected');
			}
		}
		else
		if(e.keyCode === 13) {
			$(".presult.selected").click();
		}
		else
		if(e.keyCode === 27) {
			blur_peopleSearch();
		}
	}

	function keyup_peopleSearch(e) {
		var v=$(this).val();
		if(v !== _previous_search) {
			$.getJSON("/users/mixed_search", {q:v}, function(data) {
				_people_result = data;
				updatePeopleSearchResult();
			});
			_previous_search = v;
		}
	}

	function connectFaye() {
		// console.log('Trying to connect...');
		if(typeof Faye === 'undefined') {
			return;
		}
		if(_fayeClient) {
			// console.log('Already connected [done]');
			return;
		}
		try {
			_fayeClient = new Faye.Client(__app.sharedVariables.fayeURL);
		} catch(err) {
			console.log("FAYE NOT FOUND");
			console.log(err);
			_fayeClient = null;
		}

		if(_fayeClient) {
			// console.log('Connected!');
			_fayeSub_messages = _fayeClient.subscribe('/messages/'+_userID, fayeMessageHandler_messages);
			_fayeSub_userAction = _fayeClient.subscribe('/useraction/'+_userID, _userAction.fayeMessageHandler)
			$fayeConnectionIndicator.addClass('active');
		} else {
		}
	}

	function fayeMessageHandler_messages(data) {
		console.log("FayeMessageHandler::Data::Message ", data);
		$inboxCount.html( parseInt($inboxCount.text()) + 1 );
		_snd.play();
		$inboxCount.css("background-color", "orange");
	}

	function click_profileAvatar(e) {
		if($gravatarEmailWrapper.is(":visible")) {
			statechange_gravatar_normal();
		} else {
			statechange_normal_gravatar();
		}
	}

	function keyup_gravatarEmail(e) {
		if(e.keyCode == 13) { //enter
			$gravatarEmail.blur();
			return;
		}
		$profileAvatar.attr('src', "http://gravatar.com/avatar/"+md5($gravatarEmail.val())+"?s=200");
	}
	function change_gravatarEmail(e) {
		$.get('/user/update_gravatar_email', {'email': $gravatarEmail.val()}, function(data) {
			var path = "/users/"+_userID+"/gravatar";
			$.get(path, function() {
				$profileAvatar.attr('src', path);
			});
				
		});
	}

	function statechange_gravatar_normal() {
		$gravatarEmailWrapper.slideUp();
		$sideMenuDiv.slideDown();
		$peopleSearch.slideDown();
		$peopleResult.slideUp();
		$gravatarInfobox.slideUp();
	}
	function statechange_normal_gravatar() {
		$gravatarEmailWrapper.slideDown(function() {
			$gravatarEmailWrapper.find('input:first').focus();
		});
		$sideMenuDiv.slideUp();
		$peopleSearch.slideUp();
		$peopleResult.slideUp();
		$gravatarInfobox.slideDown();
	}
	function updatePeopleSearchResult() {
		if(_people_result.length == 0) {
			hide_peopleSearch();
		} else {
			var html = "";
			var onclick = "";
			for(var i in _people_result) {
				html += "<div class='corpi_item_small presult' data-id='"+_people_result[i]['id']+"'> <img class='user-avatar-mini' src='/users/"+ _people_result[i]['id'] +"/gravatar?size=50'/> "+_people_result[i].name+"</div>";
			}
			$peopleResult.html(html);
			$('.presult:first').addClass("selected");
			$peopleResult.slideDown();
			$sideMenuDiv.slideUp();
		}
	}
	function updateInputSize(container) {
		var rows = container.val().split("\n").length+3;
		container.attr('rows', rows);
	}

	// function dwInstFix() {
	// 	var w = $profileBox.width();
	// 	var c = 0;
	// 	var f = false;
	// 	$('.inst').each(function() {
	// 		c = $(this).width() + 10;
	// 		console.log(c + ' => ' + w)
	// 		if(c >= w) {
	// 			f = true;
	// 		}
	// 	});
	// 	console.log('f = ', f);
	// 	if(f) {
	// 		$('.inst').css('display', 'block');
	// 	} else {
	// 		$('.inst').css('display', 'inline-block');
	// 	}
	// }
	// dwInstFix();
	// $(window).on('resize', dwInstFix);
};

$(function() {
	__app.modules.userhome();
});


