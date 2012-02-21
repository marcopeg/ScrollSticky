
;(function($){
	
	var _targets, _scrollTop, _check;
	
	_targets = [];
	
	
	
	
	_check = function( scrollTop, e ) {
		
		this.cfg.scrolling.call( this.$, scrollTop, this, e );
		
		// Stiky Happens!
		if ( _scrollTop >= this.stikyStart ) {
			
			// Check if it is already stiky to prevent multiple call to "onSticky" callback!
			
			if ( this.cfg.onStiky.call( this.$, scrollTop, this, e ) === false ) return;
			
			this.$.css({
				position: 	this.cfg.stikyPosition,
				top:		this.cfg.stikyTop,
				zIndex:		this.cfg.stikyZIndex
			});	
			
		// Unstiky Happens!
		} else {
			if ( this.cfg.onUnstiky.call( this.$, scrollTop, this, e ) === false ) return;
			
			this.$.css({
				position: 'relative',
				top:		'auto'
			});
			
		}
		
	} // EndOf: "_check()"
	
	
	
	
	
	
	$.fn.scrollStiky = function(cfg) {
		
		var i, found;
		
		var config = $.extend({},{
			stikyStart:		'auto',
			
			onStiky:		function( scrollTop, obj, e ) {},
			onUnstiky:		function( scrollTop, obj, e ) {},
			scrolling:		function( scrollTop, obj, e ) {},
			
			stikyPosition:	'fixed',
			stikyTop:		0,
			stikyZIndex:	9999
			
		},cfg);
		
		$(this).each(function(){
		
			var obj = {
				_:		this,
				$:		$(this),
				cfg:	config,
				stikyStart:	0
			}
			
			// Calculates the scroll value to start fixed position.
			if ( obj.cfg.stikyStart == 'auto' ) {
				obj.stikyStart = obj.$.offset().top;
			} else {
				obj.stikyStart = obj.cfg.stikyStart;
			}
			
			// Check object presence in _targets[] and update info.
			found = false;
			for ( i=0; i<_targets;i++ ) {
				if ( _targets[i]._ == this ) {
					found = true;
					_targets[i] = $.extend({},_targets[i],obj);
				}
			}
			
			// Append item to _targets[] if not found!
			if ( !found ) _targets.push(obj);
		
		
		});
		
		
		return this;
		
	};
	
	
	
	
	
	/**
	 * The Functional Code
	 * any ideas about this code optimization??
	 */
	
	$(window).bind('scroll',function(e){
		
		// Fetch the window's visible area info once for each scroll event.
		// (load balance optimization)
		_scrollTop = $(window).scrollTop();
		
		// Walk through the active items to define if they are visible or not!
		for ( var i=0; i<_targets.length; i++ ) _check.call( _targets[i], _scrollTop, e );
		
			
	});
	
})(jQuery);