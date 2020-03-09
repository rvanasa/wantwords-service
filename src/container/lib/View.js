module.exports = function()
{
	class View
	{
		constructor(selected, computed)
		{
			this.selected = selected || {};
			this.computed = computed || {};
		}
		
		include(...keys)
		{
			for(var key of keys)
			{
				this.selected[key] = 1;
			}
		}
		
		exclude(...keys)
		{
			for(var key of keys)
			{
				this.selected[key] = 0;
			}
		}
		
		compute(key, fn)
		{
			this.computed[key] = fn;
		}
	}
	
	return (...args) => new View(...args);
}