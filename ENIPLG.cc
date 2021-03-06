// SPDX-FileCopyrightText: 2020 Kaelan Thijs Fouwels <kaelan.thijs@fouwels.com>
//
// SPDX-License-Identifier: MIT

#include "ENIPLG.h"

#include "analyzer/protocol/tcp/TCP_Reassembler.h"

#include "Reporter.h"

#include "events.bif.h"

using namespace analyzer::eniplg;

/* TCP */

ENIPLG_TCP_Analyzer::ENIPLG_TCP_Analyzer(Connection* c) : tcp::TCP_ApplicationAnalyzer("ENIPLG_TCP", c)
{
	interp = new binpac::ENIPLG::ENIPLG_Conn(this);
	had_gap = false;
}

ENIPLG_TCP_Analyzer::~ENIPLG_TCP_Analyzer()
{
	delete interp;
}

void ENIPLG_TCP_Analyzer::Done()
{
	tcp::TCP_ApplicationAnalyzer::Done();
	interp->FlowEOF(true);
	interp->FlowEOF(false);
}

void ENIPLG_TCP_Analyzer::EndpointEOF(bool is_orig)
{
	tcp::TCP_ApplicationAnalyzer::EndpointEOF(is_orig);
	interp->FlowEOF(is_orig);
}

void ENIPLG_TCP_Analyzer::DeliverStream(int len, const u_char* data, bool orig)
{
	tcp::TCP_ApplicationAnalyzer::DeliverStream(len, data, orig);

	assert(TCP());
	try
	{
		interp->NewData(orig, data, data + len);
	}
	catch ( const binpac::Exception& e )
	{
		ProtocolViolation(fmt("Binpac exception: %s", e.c_msg()));
	}
}

void ENIPLG_TCP_Analyzer::Undelivered(uint64 seq, int len, bool orig)
{
	tcp::TCP_ApplicationAnalyzer::Undelivered(seq, len, orig);
}

/* UDP */

ENIPLG_UDP_Analyzer::ENIPLG_UDP_Analyzer(Connection* c) : analyzer::Analyzer("ENIPLG_UDP", c)
{
	interp = new binpac::ENIPLG::ENIPLG_Conn(this);
}

ENIPLG_UDP_Analyzer::~ENIPLG_UDP_Analyzer()
{
	delete interp;
}

void ENIPLG_UDP_Analyzer::Done()
{
	Analyzer::Done();
}

void ENIPLG_UDP_Analyzer::DeliverPacket(int len, const u_char* data, bool orig, uint64 seq, const IP_Hdr* ip, int caplen)
{
	Analyzer::DeliverPacket(len, data, orig, seq, ip, caplen);
	try
	{
		interp->NewData(orig, data, data + len);
	}
	catch ( const binpac::Exception& e )
	{
		ProtocolViolation(fmt("Binpac exception: %s", e.c_msg()));
	}
}