refine flow ENIPLG_Flow += {
	function enip_header(header: ENIP_Header): bool 
	%{
		//printf("[EVENT: enip_header] "); 
		//printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}); 
		//printf("\n"); 
		return true;
	%}
	function enip_nop(header: ENIP_Header, data: Nop): bool 
	%{
		printf("[EVENT: enip_nop]"); 
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}); 
		printf("\n"); 
		return true;
	%}
	function enip_list_services_request(header: ENIP_Header, data: List_Services_Request): bool 
	%{
		printf("[EVENT: enip_list_services_request] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}); 
		printf("\n"); 
		return true;
	%}	
	function enip_list_services_response(header: ENIP_Header, data: List_Services_Response): bool 
	%{
		printf("[EVENT: enip_list_services_response] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}); 
		printf("\n"); 
		return true;
	%}	
	function enip_list_identity_request(header: ENIP_Header, data: List_Identity_Request): bool 
	%{
		printf("[EVENT: enip_list_identity_request] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}); 
		printf("\n"); 
		return true;


		//printf("[EVENT: enip_list_identity] Vendor %#02x Product %s\n", ${data.vendor}, std_str(${data.product_name}).c_str());
	 	//BifEvent::generate_eniplg_identity(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${data.vendor}, ${data.product_name});
	%}
	function enip_list_identity_response(header: ENIP_Header, data: List_Identity_Response): bool 
	%{
		printf("[EVENT: enip_list_identity_response] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}); 
		printf("\n"); 
		return true;


		//printf("[EVENT: enip_list_identity] Vendor %#02x Product %s\n", ${data.vendor}, std_str(${data.product_name}).c_str());
	 	//BifEvent::generate_eniplg_identity(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${data.vendor}, ${data.product_name});
	%}
	function enip_list_interfaces_request(header: ENIP_Header, data: List_Interfaces_Request): bool 
	%{
		printf("[EVENT: enip_list_interfaces_request] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}); 
		printf("\n"); 
		return true;
	%}	
	function enip_list_interfaces_response(header: ENIP_Header, data: List_Interfaces_Response): bool 
	%{
		printf("[EVENT: enip_list_interfaces_response] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}); 
		printf("\n"); 
		return true;
	%}	
	function enip_register_session_request(header: ENIP_Header, data: Register_Session_Request): bool 
	%{
		printf("[EVENT: enip_register_session_request] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i proto_ver: %#04x opt_flags: %#04x", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}, ${data.protocol_version}, ${data.options_flags});  
		printf("\n"); 
		return true;
	%}	
	function enip_register_session_response(header: ENIP_Header, data: Register_Session_Response): bool 
	%{
		printf("[EVENT: enip_register_session_response] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i proto_ver: %#04x opt_flags: %#04x", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}, ${data.protocol_version}, ${data.options_flags});  
		printf("\n"); 
		return true;
	%}	
	function enip_unregister_session(header: ENIP_Header, data: UnRegister_Session): bool 
	%{
		printf("[EVENT: enip_unregister_session] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}); 
		printf("\n"); 
		return true;
	%}	
	function enip_sendrr_data(header: ENIP_Header, data: Send_RR_Data): bool 
	%{
		printf("[EVENT: enip_sendrr_data] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i int_handle: %#08x timeout: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}, ${data.InterfaceHandle}, ${data.Timeout}); 
		printf("\n"); 
		return true;
	%}	
	function enip_send_unit_data(header: ENIP_Header, data: Send_Unit_Data): bool 
	%{
		printf("[EVENT: enip_send_unit_data] ");
		printf("com: %#04x ses_handle: %#08x stat: %#08x s_cont: %#016lx opt: %#08x len: %i int_handle: %#08x timeout: %i", ${header.command}, ${header.session_handle}, ${header.status}, ${header.sender_context}, ${header.options}, ${header.length}, ${data.InterfaceHandle}, ${data.Timeout}); 
		printf("\n"); 
		return true;
	%}	
};

