
;(function($){
	
	var _targets, _scrollTop, _check;
	
	_targets = [];
	
	
	
	
	_check = function( scrollTop, e ) {
		
		this.cfg.scrolling.call( this.$, scrollTop, this, e );
		
		// Stiky Happens!
		if ( _scrollTop >= this.stikyStart ) {
			
			// Check if it is already stiky to prevent multiple call to "onSticky" callback!
			if ( this.$.hasClass(this.cfg.stikyClass) ) return;
			
			// Throw "onStiky" callback. Return "false" to block "stiky" behavior.
			if ( this.cfg.onStiky.call( this.$, scrollTop, this, e ) === false ) return;
			
			
			// Drop a placeholder element 
			if ( this.cfg.usePlaceholder ) {
				
				// Compose a placeholderID from the target object Id or from a time based id.
				this.placeholderId = this.$.attr('id');
				if ( !this.placeholderId ) this.placeholderId = new Date().getTime();	
				this.placeholderId+= '-scrollstiky-placeholder';
				
				
				this.$placeholder = $('<div>');
				
				this.$placeholder.css({
					display:	'block',
					width:		this.$.outerWidth(),
					height:		this.$.outerHeight()
				}).addClass(this.cfg.placeholderClass);
				
				this.$.after( this.$placeholder );
			
			}
			
			// Stiky the element
			this.$.css({
				position: 	this.cfg.stikyPosition,
				top:		this.cfg.stikyTop,
				zIndex:		this.cfg.stikyZIndex
			}).addClass(this.cfg.stikyClass);
			
			
		// Unstiky Happens!
		} else {
			
			// Check if it is already stiky to prevent multiple call to "onUnsticky" callback!
			if ( !this.$.hasClass(this.cfg.stikyClass) ) return;
			
			// Throw "onUnstiky" callback. Return "false" to block "unstiky" behavior.
			if ( this.cfg.onUnstiky.call( this.$, scrollTop, this, e ) === false ) return;
			
			// Remove the placeholder from the page (if present)
			if ( this.$placeholder != null ) {
				this.$placeholder.remove();
				this.$placeholder = null;
			}
			
			// Unstiky the element
			this.$.css({
				position: 	'relative',
				top:		'auto'
			}).removeClass(this.cfg.stikyClass);
			
		}
		
	} // EndOf: "_check()"
	
	
	
	
	
	
	$.fn.scrollStiky = function(cfg) {
		
		var i, found;
		
		var config = $.extend({},{
			stikyStart:		'auto',
			
			onStiky:			function( scrollTop, obj, e ) {},
			onUnstiky:			function( scrollTop, obj, e ) {},
			scrolling:			function( scrollTop, obj, e ) {},
			
			stikyPosition:		'fixed',
			stikyTop:			0,
			stikyZIndex:		9999,
			stikyClass:			'scrollstiky',
			
			usePlaceholder:		true,
			placeholderClass:	'scrollstiky-placeholder'
			
		},cfg);
		
		$(this).each(function(){
		
			var obj = {
				_:		this,
				$:		$(this),
				cfg:	config,
				stikyStart:	0,
				
				placeholderId: null,
				$placeholder:	null
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
	
	// Trigger the first scroll event to activate the scrollStiky plugin.
	$(document).ready(function(){ $(document).trigger('scroll'); });
	
})(jQuery);