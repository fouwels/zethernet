# SPDX-FileCopyrightText: 2020 Kaelan Thijs Fouwels <kaelan.thijs@fouwels.com>
#
# SPDX-License-Identifier: MIT

enum command_codes {
    NOP                 = 0x00,
    LIST_SERVICES       = 0x04,
    LIST_IDENTITY       = 0x63,
    LIST_INTERFACES     = 0x64,
    REGISTER_SESSION    = 0x65,
    UNREGISTER_SESSION  = 0x66,
    SEND_RR_DATA        = 0x6F,
    SEND_UNIT_DATA      = 0x70,
    INDICATE_STATUS     = 0x72,
    CANCEL              = 0x73,
    # Other values are Reserved for future usage or Reserved for legacy
    };

type PDU(is_orig: bool) = record {
    header: Header;
    body: case is_orig of {
        true  -> request    : Request(header);
        false -> response   : Response(header);
    };
} &byteorder=littleendian &length = 24 + header.length;

type Header = record {
    command         : uint16;               # Command identifier
    length          : uint16;               # Length of body
    session_handle  : uint32;               # Session handle
    status          : uint32;               # Status
    sender_context  : uint64;               # Sender context
    options         : uint32;               # Option flags
} &let {
    handle: bool = $context.flow.header(this);
} &byteorder=littleendian;

type Request(header: Header) = record {
    
    data : case(header.command) of {
        LIST_SERVICES           -> list_services : List_Services_Request(header);
        LIST_IDENTITY           -> list_identity : List_Identity_Request(header);
        LIST_INTERFACES         -> list_interfaces : List_Interfaces_Request(header);
        REGISTER_SESSION        -> register_session : Register_Session_Request(header);

        NOP                     -> nop : Nop(header);
        UNREGISTER_SESSION      -> unregister_session : UnRegister_Session(header);
        SEND_RR_DATA            -> send_rr_data : Send_RR_Data(header);
        SEND_UNIT_DATA          -> send_unit_data : Send_Unit_Data(header);
        
        INDICATE_STATUS         -> indicate_status : Indicate_Status_Request(header);
        CANCEL                  -> cancel : Cancel_Request(header);
        default                 -> unrecognized : Unrecognized_Request(header);
    };
} &byteorder=littleendian;

type Response(header: Header) = record {

    data: case(header.command) of {
        LIST_SERVICES       -> list_services : List_Services_Response(header);
        LIST_IDENTITY       -> list_identity : List_Identity_Response(header);
        LIST_INTERFACES     -> list_interfaces : List_Interfaces_Response(header);
        REGISTER_SESSION    -> register_session : Register_Session_Response(header);

        UNREGISTER_SESSION  -> unregister_session : UnRegister_Session(header);
        SEND_RR_DATA        -> sendrr_data : Send_RR_Data(header);
        SEND_UNIT_DATA      -> send_unit_data : Send_Unit_Data(header);

        INDICATE_STATUS     -> indicate_status : Indicate_Status_Response(header);
        CANCEL              -> cancel : Cancel_Response(header);
        default             -> unrecognized : Unrecognized_Response(header);
    };
} &byteorder=littleendian;

# Body 
type Nop(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.nop(header, this);
} &byteorder=littleendian;

type List_Services_Request(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.list_services_request(header, this);
} &byteorder=littleendian;

type List_Services_Response(header: Header) = record {
    item_count : uint16;
    items : bytestring &restofdata;
} &let {
    handle: bool = $context.flow.list_services_response(header, this);
} &byteorder=littleendian;

type List_Identity_Request(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.list_identity_request(header, this);
} &byteorder=littleendian;

type Sock_Info = record {
    sin_family  : int16;
    sin_port    : uint16;
    sin_addr    : uint32;
    sin_zero    : uint8[8];
} &byteorder=bigendian;

# Limitation: Assumes item_count of 1.
type List_Identity_Response(header: Header) = record {
    item_count          : uint16;
    type_id             : uint16;
    length              : uint16;
    encap_version       : uint16;
    sock_info           : Sock_Info;
    vendor              : uint16;
    device_type         : uint16;
    product_code        : uint16;
    revision            : uint16;
    status              : uint16;
    serial_number       : uint32;
    product_name_len    : uint8;
    product_name        : bytestring &length=product_name_len;
    state               : uint8;
} &let {
    handle: bool = $context.flow.list_identity_response(header, this);
} &byteorder=littleendian;

type List_Interfaces_Request(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.list_interfaces_request(header, this);
} &byteorder=littleendian;

type List_Interfaces_Response(header: Header) = record {
    item_count : uint16;
    items : bytestring &restofdata;
} &let {
    handle: bool = $context.flow.list_interfaces_response(header, this);
} &byteorder=littleendian;

type Register_Session_Request(header: Header) = record {
    protocol_version : uint16;
    options_flags : uint16;
} &let {
    handle: bool = $context.flow.register_session_request(header, this);
} &byteorder=littleendian;

type Register_Session_Response(header: Header) = record {
    protocol_version : uint16;
    options_flags : uint16;
} &let {
    handle: bool = $context.flow.register_session_response(header, this);
} &byteorder=littleendian;

type Send_RR_Data(header: Header) = record {
    interface_handle : uint32;
    timeout : uint16;
    encapsulated_packet : bytestring &restofdata;
} &let {
    handle: bool = $context.flow.send_rr_data(header, this);
} &byteorder=littleendian;

type Send_Unit_Data(header: Header) = record {
    interface_handle : uint32;
    timeout : uint16;
    encapsulated_packet : bytestring &restofdata;
} &let {
    handle: bool = $context.flow.send_unit_data(header, this);
} &byteorder=littleendian;

type UnRegister_Session(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.unregister_session(header, this);
} &byteorder=littleendian;

type Indicate_Status_Request(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.indicate_status_request(header, this);
} &byteorder=littleendian;

type Indicate_Status_Response(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.indicate_status_response(header, this);
} &byteorder=littleendian;

type Cancel_Request(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.cancel_request(header, this);
} &byteorder=littleendian;

type Cancel_Response(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.cancel_response(header, this);
} &byteorder=littleendian;

type Unrecognized_Request(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.unrecognized_request(header, this);
} &byteorder=littleendian;

type Unrecognized_Response(header: Header) = record {
    # None
} &let {
    handle: bool = $context.flow.unrecognized_response(header, this);
} &byteorder=littleendian;