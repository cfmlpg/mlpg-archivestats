// ==UserScript==
// @name           MLPG Archive Stats
// @version        1.1.1
// @namespace      cfmlpg
// @description    Shows thread statistics in MLPG's archive.
// @author         cfmlpg
// @include        http://arch.413chan.net/mlpgeneral/
// @updateURL      https://raw.github.com/cfmlpg/mlpg-archivestats/master/mlpgarchivestats.user.js
// @downloadURL    https://raw.github.com/cfmlpg/mlpg-archivestats/master/mlpgarchivestats.user.js
// @run-at         document-end
// ==/UserScript==

(function()
{
	var d, $, $$, Counter, Stats, UI, Main;
	
	d = document;
	
	$ = function(selector, element)
	{
		return (element || d).querySelector(selector);
	};
	
	$.el = function(tag, attributes)
	{
		var el = d.createElement(tag);
		if (attributes)
			for (var key in attributes)
				el[key] = attributes[key];
		return el;
	};
	
	$.tn = function(text)
	{
		return d.createTextNode(text);
	};
	
	$.add = function(parent, child)
	{
		return parent.appendChild(child);
	};
	
	$$ = function(selector, element)
	{
		return [].slice.call((element || d).querySelectorAll(selector));
	};
	
	Counter = function()
	{
		this.count = function()
		{
			return new Stats(getThreadCount(), getPostCount(), getImageCount(), getSageCount());
		};
		
		var getThreadCount = function()
		{
			return $$('table td:nth-child(2)').length;
		};
		
		var getPostCount = function()
		{
			return countStats([].concat(getArchivedThreadsFields(3), getCurrentThreadsFields(1)));
		};
		
		var getImageCount = function()
		{
			return countStats([].concat(getArchivedThreadsFields(4), getCurrentThreadsFields(2)));
		};
		
		var getSageCount = function()
		{
			return countStats([].concat(getArchivedThreadsFields(5), getCurrentThreadsFields(3)));
		};
		
		var getArchivedThreadsFields = function(field)
		{
			return $$('div table td:nth-child(' + field + ')');
		};
		
		var getCurrentThreadsFields = function(field)
		{
			return $$('center>table td:nth-child(' + field + ')');
		};
		
		var countStats = function(els)
		{
			var count = 0;
			for (var i = 0; i < els.length; ++i)
				count += parseElement(els[i]);
			return count;
		};
		
		var parseElement = function(el)
		{
			var num;
			return (isNaN(num = parseInt(el.innerHTML))) ? 0 : num;
		};
	};
	
	Stats = function(threads, posts, images, sages)
	{
		this.threads = threads;
		this.posts = posts;
		this.images = images;
		this.sages = sages;
		
		this.toString = function()
		{
			return 	'Total of ' + this.posts.toLocaleString() + ' posts, ' +
					this.images.toLocaleString() + ' images and ' +
					this.sages.toLocaleString() + ' sages in ' +
					this.threads.toLocaleString() + ' threads.';
		};
	};
	
	UI = function()
	{
		var container = null;
		
		var __construct = function()
		{
			push();
			container = $.add(d.body, createStatsContainer());
		};
		
		var createStatsContainer = function()
		{
			var el;
			el = $.el('div', { id: 'postcount' });
			el.style.width = '100%';
			el.style.height = '20px';
			el.style.position = 'fixed';
			el.style.display = 'block';
			el.style.bottom = '0px';
			el.style.left = '0px';
			el.style.zIndex = '100';
			el.style.padding = '5px';
			el.style.backgroundColor = '#fff';
			el.style.borderTop = '1px solid #000'; 
			el.style.textAlign = 'center';
			return el;
		};
		
		var push = function()
		{
			var el;
			el = $.el('div', { id: 'push' });
			el.style.height = '30px';
			$.add(d.body, el);
		};
		
		this.setMessage = function(msg)
		{
			if (container)
			{
				container.innerHTML = '';
				$.add(container, $.tn(msg));
			}
		};
		
		__construct();
	};
	
	Main =
	{
		init: function()
		{
			(new UI()).setMessage(((new Counter()).count()).toString());
		}
	};
	
	Main.init();
	
})();