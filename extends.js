	/*
	2018/7/29 继承案例
	.hasOwnProperty(pro)
	用来判断某个对象是否含有指定的属性的 返回Boolean

	调用一个函数, 其具有一个指定的this值和分别地提供的参数(参数的列表)
	call()	方法接受的是若干个参数的列表
	apply()	方法接受的是一个包含多个参数的数组

	constructor 属性返回对创建此对象的数组函数的引用。
	*/
	var Animal, Horse, Snake, sam, tom,
	__hasProp = {}.hasOwnProperty,
	__extends = function(child, parent) { 
		for (var key in parent) { 
			alert(key+"--out");
			if (__hasProp.call(parent, key)) {
				alert(key+"-out");
				child[key] = parent[key]; 
			}	
		} 
		function ctor() { 
			this.constructor = child; 
		} 
		ctor.prototype = parent.prototype; 
		child.prototype = new ctor(); 
		child.__super__ = parent.prototype;
		for(var pro in parent.prototype)
			alert("---pro:" + pro);
		return child; 
	};
	//alert(__hasProp);
	Animal = (function() {
		function Animal(name) {
			this.name = name;
		}
		Animal.prototype.move = function(meters) {
			return alert(this.name + (" moved " + meters + "m."));
		};
		return Animal;
	})();
	Snake = (function(_super) {
		__extends(Snake, _super);
		function Snake() {
			return Snake.__super__.constructor.apply(this, arguments);
		}
		Snake.prototype.move = function() {
			alert("Slithering...");
			return Snake.__super__.move.call(this, 5);
		};
		return Snake;
	})(Animal);
	//alert(Snake["move"]);
	Horse = (function(_super) {
		__extends(Horse, _super);
		function Horse() {
			return Horse.__super__.constructor.apply(this, arguments);
		}
		Horse.prototype.move = function() {
			alert("Galloping...");
			return Horse.__super__.move.call(this, 45);
		};
		return Horse;

	})(Animal);

	sam = new Snake("Sammy the Python");

	tom = new Horse("Tommy the Palomino");

	sam.move();

	tom.move();
