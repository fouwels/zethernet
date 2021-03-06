// SPDX-FileCopyrightText: 2020 Kaelan Thijs Fouwels <kaelan.thijs@fouwels.com>
//
// SPDX-License-Identifier: MIT

#ifndef ANALYZER_PROTOCOL_ENIPLG_ENIPLG_H
#define ANALYZER_PROTOCOL_ENIPLG_ENIPLG_H

#include "events.bif.h"
#include "analyzer/protocol/tcp/TCP.h"
#include "eniplg_pac.h"

namespace analyzer { namespace eniplg {

class ENIPLG_TCP_Analyzer : public tcp::TCP_ApplicationAnalyzer
{
	public:
		ENIPLG_TCP_Analyzer(Connection* conn);
		virtual ~ENIPLG_TCP_Analyzer();

		// Overriden from Analyzer.
		virtual void Done();
		virtual void DeliverStream(int len, const u_char* data, bool orig);
		virtual void Undelivered(uint64 seq, int len, bool orig);

		// Overriden from tcp::TCP_ApplicationAnalyzer.
		virtual void EndpointEOF(bool is_orig);
		
		static analyzer::Analyzer* InstantiateAnalyzer(Connection* conn)
		{
			return new ENIPLG_TCP_Analyzer(conn);
		}

	protected:
		binpac::ENIPLG::ENIPLG_Conn* interp;
		bool had_gap;
};

class ENIPLG_UDP_Analyzer : public analyzer::Analyzer 
{
	public:
		ENIPLG_UDP_Analyzer(Connection* conn);
		virtual ~ENIPLG_UDP_Analyzer();

		// Overriden from Analyzer.
		virtual void Done();
		virtual void DeliverPacket(int len, const u_char* data, bool orig, uint64 seq, const IP_Hdr* ip, int caplen);
		static analyzer::Analyzer* InstantiateAnalyzer(Connection* conn)
		{
			return new ENIPLG_UDP_Analyzer(conn); 
		}

	protected:
		binpac::ENIPLG::ENIPLG_Conn* interp;
};


} } // namespace analyzer::* 

#endif