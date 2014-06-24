$.fn.passwordStrength = function( options ){
	return this.each(function(){
		var that = this;that.opts = {};
		that.opts = $.extend({}, $.fn.passwordStrength.defaults, options);
		
		that.div = $(that.opts.targetDiv);
		that.defaultClass = that.div.attr('class');
		
		that.percents = (that.opts.classes.length) ? 100 / that.opts.classes.length : 100;
		 			// 16			32		48			64		  80		96
		that.words = ['Very weak','Weak','Strong','Very Strong','Heavy','Very Heavy'];
		
		 v = $(this)
		.change(function(){
			if( typeof el == "undefined" )
				this.el = $(this);
			var s = getPasswordStrength (this.value);
			var p = this.percents;
			var t = Math.floor( s / p );
			p = t*10;
			if(p <= 16){
				var text = this.words[0];
			} 
			else if(p <= 32){
				var text = this.words[1];
			}
			else if(p <= 48){
				var text = this.words[2];
			}
			else if(p <= 64){
				var text = this.words[3];
			}
			else if(p <= 80){
				var text = this.words[4];
			}
			else if(p >= 90){
				var text = this.words[5];
			}
			if( 100 <= s )
				t = this.opts.classes.length - 1;
				
			this.div
				.removeAttr('class')
				.addClass( this.defaultClass )
				.addClass( this.opts.classes[ t ] ).text(text);
				
		}).keyup(function(){
			if( typeof el == "undefined" )
				this.el = $(this);
			var s = getPasswordStrength (this.value);
			var p = this.percents;
			var t = Math.floor( s / p );
			p = t*10;
			if(p <= 16){
				var text = this.words[0];
			} 
			else if(p < 32){
				var text = this.words[1];
			}
			else if(p < 48){
				var text = this.words[2];
			}
			else if(p < 64){
				var text = this.words[3];
			}
			else if(p < 80){
				var text = this.words[4];
			}
			else if(p > 96){
				var text = this.words[5];
			}			
			if( 100 <= s )
				t = this.opts.classes.length - 1;
				
			this.div
				.removeAttr('class')
				.addClass( this.defaultClass )
				.addClass( this.opts.classes[ t ] ).text(text);
				
		});
		
	});

	function getPasswordStrength(H){
		var D=(H.length);
		if(D>5){
			D=5;
		}
		var F=H.replace(/[0-9]/g,"");
		var G=(H.length-F.length);
		if(G>3){G=3;}
		var A=H.replace(/\W/g,"");
		var C=(H.length-A.length);
		if(C>3){C=3;}
		var B=H.replace(/[A-Z]/g,"");
		var I=(H.length-B.length);
		if(I>3){I=3;}
		var E=((D*10)-20)+(G*10)+(C*15)+(I*10);
		if(E<0){E=0;}
		if(E>100){E=100;}
		return E;
	}
};
	
$.fn.passwordStrength.defaults = {
	classes : Array('is10','is20','is30','is40','is50','is60','is70','is80','is90','is100'),
	targetDiv : '#passwordStrengthDiv',
	cache : {}
};

jQuery(document).ready(function($) {
	containerHeight = $('#content').height();
	containerWidth = $('#ocPassman').width();

	$('#ocpContent').width(containerWidth - $('.menuContainer').width() - 2);
	$('#pwList').width(containerWidth - $('.menuContainer').width());
	$('#pwList').height(containerHeight - $('#infoContainer').height());

	/* Setup menu */
	$('#jsTree').jstree({
		"core" : {
			// so that create works
			"check_callback" : true
		},
		"plugins" : ["contextmenu"],
		"contextmenu" : {
			"items" : function($node) {
				var tree = $("#jsTree").jstree(true);
				return {
					"Create" : {
						"separator_before" : false,
						"separator_after" : false,
						"label" : "Create",
						"action" : function(obj) {
							$node = tree.create_node($node);
							tree.edit($node);
						}
					},
					"Rename" : {
						"separator_before" : false,
						"separator_after" : false,
						"label" : "Rename",
						"action" : function(obj) {
							tree.edit($node);
						}
					},
					"Remove" : {
						"separator_before" : false,
						"separator_after" : false,
						"label" : "Remove",
						"action" : function(obj) {
							tree.delete_node($node);
						}
					}
				};
			}
		}
	}).bind('create_node.jstree', function(node, ref) {
		console.log('oncreate');
	}).bind('rename_node.jstree', function(node, ref) {
		console.log('onrename');
	}).bind('delete_node.jstree', function(node, ref) {
		console.log('ondelete');
		return false;
	}).jstree('open_node', $('#node-1'));

	$('#pwList li').click(function(evt) {
		$('#pwList li').removeClass('row-active');
		$(this).addClass('row-active');

	}).hover(function() {
		var appendhtml = '<span id="actions"><a href="#" class="action" data-action="Share" original-title=""><img class="svg" src="/core/img/actions/share.svg"><span> Share</span></a><a href="#" class="action" data-action="Edit" original-title=""><img class="svg" src="/core/img/actions/rename.svg"><span> Edit</span></a><a href="#" class="action" original-title=""><img class="svg" src="/core/img/actions/delete.svg"><span> Delete</span></a></span>';
		$(this).append(appendhtml);
	}, function() { 
		$('#actions').remove();
	});

	$('#addItem').click(function() {
		$('#editAddItemDialog').dialog({
			"width" : 425
		});
		$('#item_tabs').tabs();
	});

	$('#custom_pw').buttonset();
	$('#pwTools').tooltip();
	
	$('.icon-toggle').toggle(function() {
		$("#pw1").attr('type', 'text');
	}, function() {
		$("#pw1").attr('type', 'password');
	});
	$('.icon-paste').click(function(){
		$('#pw2').val($('#pw1').val());
	});
	$('.icon-history').click(function() {
		var length = $('#pw_size').val();
		var charset = "", retVal = "";

		var pw_symbols = "!\"#$%&'()*+,-./:;< = >?@[\\]^_`{|}~";
		var pw_digits = '0123456789';
		var pw_uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var pw_lowers = 'abcdefghijklmnopqrstuvwxyz';

		if ($('#pw_numerics:checked').length > 0) {
			charset += pw_digits;
		}
		if ($('#pw_maj:checked').length > 0) {
			charset += pw_lowers + pw_uppers;
		}
		//
		if ($('#pw_symbols:checked').length > 0) {
			charset += pw_symbols;
		}
		for (var i = 0, n = charset.length; i < length; ++i) {
			retVal += charset.charAt(Math.floor(Math.random() * n));
		}
		$('#pw1').val(retVal).change();
	});
	$('#pw1').passwordStrength();
});

