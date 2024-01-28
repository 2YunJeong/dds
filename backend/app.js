const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app) //http서버 생성
const io = require('socket.io')(server, { cors: { origin: "*" } }) //http서버를 socket.io 서버로 업그레이드

//====================================================================================//
function init_opendds(opendds_addon) {
    return opendds_addon.initialize(... process.argv.slice(2));
}

function log(label, object) {
    console.log(label + ': ' + JSON.stringify(object, null, 2));
}

function str2arr(input) {
    return input.split('');
}

var DOMAIN_ID = 32;
var qos = { user_data: { value: str2arr('foo') } };
var dds_inf = 0x7fffffff
var infinite = { sec: dds_inf, nanosec: dds_inf }
let SampleArr = []
let sendArr = []

var opendds_addon = require('opendds')
var factory = init_opendds(opendds_addon)
var library = opendds_addon.load('../config/Switch')
var participant = factory.create_participant(DOMAIN_ID, qos)

//Check library(/libSwitch.so)
if (!library) {
    throw new Error('opendds: Failed to load shared library')
}

var reader = participant.subscribe('topic', 'OpenDDSWIS::SwitchTopic', {
    ContentFilteredTopic: {
      filter_expression: 'topicCount < %0',
      expression_parameters: ['30']
    },
    SubscriberQos: {
      presentation: {
        access_scope: 'INSTANCE_PRESENTATION_QOS',
        coherent_access: false,
        ordered_access: false
      },
      group_data: { value: str2arr('test') }
    },
    DataReaderQos: {
      durability: { kind: 'VOLATILE_DURABILITY_QOS' },
      latency_budget: { duration: { sec: 1, nanosec: 0 } },
      liveliness: {
        kind: 'AUTOMATIC_LIVELINESS_QOS',
        lease_duration: infinite
      },
      reliability: {
        kind: 'RELIABLE_RELIABILITY_QOS',
        max_blocking_time: { sec: 1, nanosec: 0 }
      },
      destination_order: { kind: 'BY_RECEPTION_TIMESTAMP_DESTINATIONORDER_QOS' },
      history: {
        kind: 'KEEP_LAST_HISTORY_QOS',
        depth: 10
      },
      resource_limits: {
        max_samples: 1000,
        max_instances: 100,
        max_samples_per_instance: 10
      },
      user_data: { value: str2arr('arbitrary string') },
      ownership: { kind: 'SHARED_OWNERSHIP_QOS' },
      time_based_filter: { minimum_separation: { sec: 0, nanosec: 0 } },
      reader_data_lifecycle: {
        autopurge_nowriter_samples_delay: infinite,
        autopurge_disposed_samples_delay: infinite
      }
    }
}, function (dr, sinfo, sample) {
    try{
        if (sinfo.valid_data) {
            console.log('Data read successful')
            SampleArr = []
            
            SampleArr.push(sample.topicCount)
            SampleArr.push(sample.s.idfO.description)
            SampleArr.push(sample.s.idfO.name)
            SampleArr.push(sample.s.US)
            console.log('Data Array : ' + SampleArr)

            sendArr.push(SampleArr)
        }
    }
    catch (e) {
        console.log('opendds: Error in callback: ' + e)
    }
})

process.on('exit', function () {
    factory.delete_participant(participant); // optional
    opendds_addon.finalize(factory);
});

//====================================================================================//
io.on('connection', (socket) => {
    console.log('socket server connected - socket.id: ', socket.id)

    io.emit('openDDSDataEmit', sendArr)
})

server.keepAliveTimeout = 30 * 1000
server.headersTimeout = 35 * 1000

server.listen(3001, function() {
    console.log('socket io server listening on port 3001')
})