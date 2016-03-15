var five = require('johnny-five'),
	Rx = require('rx'),
	board = new five.Board(),
	led,
	toggleState = false;

board.on('ready', function(){
	console.log('Board ready');
	led = new five.Led(13);

	var source = Rx.Observable.create(function(observer){

		var id = setInterval(function(){
			console.log('hit timeout');
			observer.onNext(toggleLED());
		}, 500);

		console.log('started');

		return function(){
			console.log('disposing');
			clearInterval(id);
			led.off();
		}
	})

	function toggleLED(){
		toggleState = !toggleState;

		if(toggleState) led.on();
		else led.off();

		return toggleState;
	}

	var sub = source.subscribe(function(x){
		console.log('next ' + x);
	}, function(err){
		console.error(err);
	}, function(){
		console.info('done');
	});

	setTimeout(function(){
		sub.dispose();
	}, 10000);
});

console.log('\nwaiting for device to connect...');