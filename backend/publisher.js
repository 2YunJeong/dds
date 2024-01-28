"use strict";

function str2arr(input) {
  return input.split('');
}

function init_opendds(opendds_addon) {
  return opendds_addon.initialize(... process.argv.slice(2));
}

var DOMAIN_ID = 32;
var qos = { user_data: { value: str2arr('foo') } };

var opendds_addon = require('opendds')
var util = require('util')
var sleep = util.promisify(setTimeout)
var factory = init_opendds(opendds_addon)
var library = opendds_addon.load('../config/Switch')
var participant = factory.create_participant(DOMAIN_ID, qos)
var writer
var dds_inf = 0x7fffffff
var infinite = { sec: dds_inf, nanosec: dds_inf }

function log(label, object) {
  console.log(label + ': ' + JSON.stringify(object, null, 2));
}

var topicCount = 0

function doStuff(writer) {
  console.log("writer has waited long enough for association");

  var sample = {
	  topicCount: topicCount,
	  s: {
		  idfO:{
			  description: "hello",
			  name: "LYJ",
		  },
		  US: "UnitSymbol_A"
	  }
  }

  var handle = 0, retcode = 0;
  for (var i = 0; i<30; i++){
    sample.topicCount = i
    
    handle = writer.register_instance(sample);
    retcode = writer.write(sample, handle);
    retcode = writer.wait_for_acknowledgments();
    retcode = writer.dispose(sample, handle);
    retcode = writer.unregister_instance(sample, handle);
  }
}

try {
  if (!library) {
    throw 'Failed to load shared library';
  }
  writer = participant.create_datawriter('topic', 'OpenDDSWIS::SwitchTopic', {
    DataWriterQos: {
      latency_budget: { sec: 1, nanosec: 0 },
      liveliness: { lease_duration: { sec: 5, nanosec: 0 } }
    }
  });

  setTimeout(function () { doStuff(writer); }, 15000);

} catch (e) {
  console.log(e);
}

process.on('exit', function () {
  factory.delete_participant(participant); // optional
  opendds_addon.finalize(factory);
});