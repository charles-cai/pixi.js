/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.TextureCache = {};
PIXI.FrameCache = {};

/**
 * A texture stores the information that represents an image or part of an image. It cannot be added to the display list directly. To do this use PIXI.Sprite. If no frame is provided then the whole image is used
 * @class Texture
 * @extends EventTarget
 * @constructor
 * @param baseTexture {BaseTexture}
 * @param frmae {Rectangle}
 */
PIXI.Texture = function(baseTexture, frame)
{
	PIXI.EventTarget.call( this );
	
	if(!frame)
	{
		this.noFrame = true;
		frame = new PIXI.Rectangle(0,0,1,1);
	}
	
	this.trim = new PIXI.Point();
	
	/**
	 * The base texture of this texture
	 * @property baseTexture
	 * @type BaseTexture
	 */
	this.baseTexture = baseTexture;
	
	
	
	/**
	 * The frame specifies the region of the base texture that this texture uses
	 * @property frame
	 * @type #Rectangle
	 */
	this.frame = frame;
	
	this.scope = this;
	
	if(baseTexture.hasLoaded)
	{
		if(this.noFrame)frame = new PIXI.Rectangle(0,0, baseTexture.width, baseTexture.height);
		//console.log(frame)
		
		this.setFrame(frame);
	}
	else
	{
		var scope = this;
		baseTexture.addEventListener( 'loaded', function(){ scope.onBaseTextureLoaded()} );
	}
}

PIXI.Texture.constructor = PIXI.Texture;

PIXI.Texture.prototype.onBaseTextureLoaded = function(event)
{
	var baseTexture = this.baseTexture;
	baseTexture.removeEventListener( 'loaded', this.onLoaded );
	
	if(this.noFrame)this.frame = new PIXI.Rectangle(0,0, baseTexture.width, baseTexture.height);
	this.noFrame = false;
	this.width = this.frame.width;
	this.height = this.frame.height;
	
	this.scope.dispatchEvent( { type: 'update', content: this } );
}

/**
 * Specifies the rectangle region of the baseTexture
 * @method setFrame
 * @param frame {Rectangle}
 */
PIXI.Texture.prototype.setFrame = function(frame)
{
	this.frame = frame;
	this.width = frame.width;
	this.height = frame.height;
	//this.updateFrame = true;
}

/**
 * 
 * Helper function that returns a texture based on an image url
 * If the image is not in the texture cache it will be  created and loaded
 * @static
 * @method fromImage
 * @param imageUrl {String} The image url of the texture
 * @return Texture
 */
PIXI.Texture.fromImage = function(imageUrl)
{
	var texture = PIXI.TextureCache[imageUrl];
	
	if(!texture)
	{
		var baseTexture = PIXI.BaseTextureCache[imageUrl];
		if(!baseTexture) 
		{
			var image = new Image();//new Image();
			image.src = imageUrl;
			
			baseTexture = new PIXI.BaseTexture(image);
			PIXI.BaseTextureCache[imageUrl] = baseTexture;
		}
		texture = new PIXI.Texture(baseTexture);
		
		
		PIXI.TextureCache[imageUrl] = texture;
		
		
	}
	
	return texture;
}

/**
 * 
 * Helper function that returns a texture based on a frame id
 * If the frame id is not in the texture cache an error will be thrown
 * @method fromFrame
 * @param frameId {String} The frame id of the texture
 * @return Texture
 */
PIXI.Texture.fromFrame = function(frameId)
{
	var texture = PIXI.TextureCache[frameId];
	if(!texture)throw new Error("The frameId '"+ frameId +"' does not exist in the texture cache " + this);
	return texture;
}

/**
 * 
 * Helper function that returns a texture based on a canvas element
 * If the canvas is not in the texture cache it will be  created and loaded
 * @static
 * @method fromCanvas
 * @param canvas {Canvas} The canvas element source of the texture
 * @return Texture
 */
PIXI.Texture.fromCanvas = function(canvas)
{
	// create a canvas id??
	var texture = PIXI.TextureCache[canvas];
	
	if(!texture)
	{
		var baseTexture = PIXI.BaseTextureCache[canvas];
		if(!baseTexture) 
		{
			baseTexture = new PIXI.BaseTexture(canvas);
			PIXI.BaseTextureCache[canvas] = baseTexture;
		}
		texture = new PIXI.Texture(baseTexture);
		
		PIXI.TextureCache[canvas] = texture;
	}
	
	return texture;
}


/**
 * 
 * Adds a texture to the textureCache. 
 * @method addTextureToCache
 * @param texture {Texture}
 * @param id {String} the id that the texture will be stored against.
 */
PIXI.Texture.addTextureToCache = function(texture, id)
{
	PIXI.TextureCache[id] = texture;
}

/**
 * 
 * Remove a texture from the textureCache. 
 * @method removeTextureFromCache
 * @param id {String} the id of the texture to be removed
 */
PIXI.Texture.removeTextureFromCache = function(id)
{
	PIXI.TextureCache[id] = texture;
}

