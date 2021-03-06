# SPDX-FileCopyrightText: 2020 Kaelan Thijs Fouwels <kaelan.thijs@fouwels.com>
#
# SPDX-License-Identifier: MIT

##! Implements base functionality for eniplg analysis.
##! Generates the Eniplg.log file.

module Eniplg;

export {
	redef enum Log::ID += { LOG, LOG_HEADERS, LOG_IDENTITIES, LOG_UNRECOGNIZED };

	type Event: record {
		## Timestamp for when the event happened.
		ts:     time    &log;
		## Unique ID for the connection.
		uid:    string  &log;
		## The connection's 4-tuple of endpoint addresses/ports.
		id:     conn_id &log;

		event_name: string  &log;
		command_code: string &optional &log;
	};

	type Identity: record {
		## Timestamp for when the event happened.
		ts:     time    &log;
		## Unique ID for the connection.
		uid:    string  &log;
		## The connection's 4-tuple of endpoint addresses/ports.
		id:     conn_id &log;

		item_count: count &log;
		type_id: count &log;
		encap_version: count;
		sock_info_sin_family: count &log;
		sock_info_sin_port: count &log;
		sock_info_sin_addr: count &log;
		vendor: count &log;
		device_type: count &log;
		product_code: count &log;
		revision: count &log;
		status: count &log;
		serial_number: count &log;
		product_name: string &log;
		state: count &log;
	};

	## Event that can be handled to access the eniplg record as it is sent on
	## to the loggin framework.
	global log_eniplg: event(rec: Event);
	global log_eniplg_headers: event(rec: Event);
	global log_eniplg_unrecognized: event(rec: Event);
	global log_eniplg_identity: event(rec: Identity);
}

# TODO: The recommended method to do dynamic protocol detection
# (DPD) is with the signatures in dpd.sig. If you can't come up
# with any signatures, then you can do port-based detection by
# uncommenting the following and specifying the port(s):

const tcp_ports = { 44818/tcp };
const udp_ports = { 2222/udp, 44818/udp  };
redef likely_server_ports += { tcp_ports };
redef likely_server_ports += { udp_ports };

event zeek_init() &priority=5
{
	Log::create_stream(Eniplg::LOG, [$columns=Event, $ev=log_eniplg, $path="eniplg"]);
	Log::create_stream(Eniplg::LOG_HEADERS, [$columns=Event, $ev=log_eniplg_headers, $path="eniplg_headers"]);
	Log::create_stream(Eniplg::LOG_UNRECOGNIZED, [$columns=Event, $ev=log_eniplg_unrecognized, $path="eniplg_unrecognized"]);
	Log::create_stream(Eniplg::LOG_IDENTITIES, [$columns=Identity, $ev=log_eniplg_identity, $path="eniplg_identities"]);
	Analyzer::register_for_ports(Analyzer::ANALYZER_ENIPLG_TCP, tcp_ports);
	Analyzer::register_for_ports(Analyzer::ANALYZER_ENIPLG_UDP, udp_ports);
}

# eniplg_identities.log

event eniplg_list_identity_response(c: connection,
	item_count: count,
	type_id: count,
	encap_version: count,
	sock_info_sin_family: count,
	sock_info_sin_port: count,
	sock_info_sin_addr: count,
	vendor: count,
	device_type: count,
	product_code: count,
	revision: count,
	status: count,
	serial_number: count,
	product_name: string,
	state: count
){
	local idnt: Identity;
	idnt$ts  = network_time();
	idnt$uid = c$uid;
	idnt$id  = c$id;
	idnt$item_count = item_count;
	idnt$type_id = type_id;
	idnt$encap_version = encap_version;
	idnt$sock_info_sin_family = sock_info_sin_family;
	idnt$sock_info_sin_port = sock_info_sin_port;
	idnt$sock_info_sin_addr = sock_info_sin_addr;
	idnt$vendor = vendor;
	idnt$device_type = device_type;
	idnt$product_code = product_code;
	idnt$revision = revision;
	idnt$status = status;
	idnt$serial_number = serial_number;
	idnt$product_name = product_name;
	idnt$state = state;

	Log::write(Eniplg::LOG_IDENTITIES, idnt);
}

# eniplg_headers.log

event eniplg_header(c: connection, 
	command: count, 
	length: count, 
	session_handle: count, 
	status: count, 
	sender_context: count, 
	options: count
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_header";
	ev$command_code = fmt("%d", command);

	Log::write(Eniplg::LOG_HEADERS, ev);
}

# eniplg.log

event eniplg_nop(c: connection
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_nop";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_list_services_request(c: connection
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_list_services_request";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_list_services_response(c: connection,
	item_count: count
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_list_services_response";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_list_identity_request(c: connection
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_list_identity_request";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_list_interfaces_request(c: connection
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_list_interfaces_request";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_list_interfaces_response(c: connection, 
	item_count: count
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_list_interfaces_response";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_register_session_request(c: connection, 
	protocol_version: count,
	options_flags: count
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_register_session_request";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_register_session_response(c: connection, 
	protocol_version: count,
	options_flags: count
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_register_session_response";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_unregister_session(c: connection
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_unregister_session";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_send_rr_data(c: connection, 
	interface_handle: count,
	timeout_val: count
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_send_rr_data";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_send_unit_data(c: connection, 
	interface_handle: count,
	timeout_val: count
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_send_unit_data";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_indicate_status_request(c: connection
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_indicate_status_request";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_indicate_status_response(c: connection
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_indicate_status_response";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_cancel_request(c: connection
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_cancel_request";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_cancel_response(c: connection
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_cancel_response";

	Log::write(Eniplg::LOG, ev);
}

event eniplg_unrecognized_request(c: connection,
command: count
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_unrecognized_request";
	ev$command_code = fmt("%d", command);

	Log::write(Eniplg::LOG_UNRECOGNIZED, ev);
}

event eniplg_unrecognized_request(c: connection,
command: count
){
	local ev: Event;
	ev$ts  = network_time();
	ev$uid = c$uid;
	ev$id  = c$id;
	ev$event_name = "eniplg_unrecognized_response";
	ev$command_code = fmt("%d", command);

	Log::write(Eniplg::LOG_UNRECOGNIZED, ev);
}