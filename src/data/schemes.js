/* ======================= DATA: rate tables, straight from the GRs =======================
 years: disbursement period · cap: capital % EFCI · capMode: 'micro1' = in year 1, else equal annual instalments
 int: interest rate on term loan · intCap: % EFCI · pow: ₹/unit · powCap: % EFCI · total: overall % EFCI
 ann: annual ceiling % EFCI (micro: [year1, later]) · abs: absolute annual ceiling ₹ Cr · epf: EPF years
*/
export const SCHEMES = {
 msme_gen: {name:"MSME · સામાન્ય", ref:"MSME GR para 4.2", years:5, epf:5,
   A:{cap:35,int:7,intCap:10,pow:2,powCap:25,total:45,ann:9,annMicro:[37,2]},
   B:{cap:25,int:7,intCap:10,pow:1,powCap:25,total:35,ann:7,annMicro:[27,2]}},
 msme_sel: {name:"MSME · પસંદગીનું થ્રસ્ટ સેક્ટર", ref:"MSME GR para 4.3", years:5, epf:5,
   A:{cap:35,int:7,intCap:20,pow:2,powCap:20,total:50,ann:10,annMicro:[38,3]},
   B:{cap:30,int:7,intCap:20,pow:1,powCap:20,total:45,ann:9,annMicro:[33,3]}},
 large_gen: {name:"લાર્જ · સામાન્ય સેક્ટર", ref:"Large GR para 4-B", years:10, epf:10, abs:150,
   A:{cap:15,int:7,intCap:15,pow:2,powCap:15,total:20,ann:2.0},
   B:{cap:10,int:7,intCap:10,pow:1,powCap:10,total:15,ann:1.5}},
 large_thr: {name:"લાર્જ · થ્રસ્ટ સેક્ટર", ref:"Large GR para 4-C", years:8, epf:8, abs:300,
   A:{cap:25,int:7,intCap:20,pow:2,powCap:20,total:35,ann:4.5},
   B:{cap:15,int:7,intCap:15,pow:1,powCap:15,total:25,ann:3.5}},
 mega_thr: {name:"મેગા · થ્રસ્ટ સેક્ટર", ref:"Large GR para 4-D", years:10, epf:10, abs:750, hpc:true,
   A:{cap:25,int:7,intCap:25,pow:2,powCap:25,total:35,ann:3.5},
   B:{cap:20,int:7,intCap:20,pow:1,powCap:20,total:30,ann:3.0}},
 ultra_thr: {name:"અલ્ટ્રા-મેગા · થ્રસ્ટ સેક્ટર", ref:"Large GR para 4-E", years:12, epf:10, abs:1250, hpc:true,
   A:{cap:30,int:7,intCap:25,pow:2,powCap:25,total:40,ann:3.5},
   B:{cap:25,int:7,intCap:20,pow:1,powCap:20,total:35,ann:3.0}},
 large_sel: {name:"લાર્જ · પસંદગીનું થ્રસ્ટ સેક્ટર", ref:"Large GR para 4-F", years:8, epf:10, abs:300,
   A:{cap:35,int:7,intCap:20,pow:2,powCap:20,total:50,ann:6.5},
   B:{cap:30,int:7,intCap:20,pow:1,powCap:20,total:45,ann:6.0}},
 mega_sel: {name:"મેગા · પસંદગીનું થ્રસ્ટ સેક્ટર", ref:"Large GR para 4-G", years:10, epf:10, abs:750, hpc:true,
   A:{cap:35,int:7,intCap:20,pow:2,powCap:20,total:50,ann:5.0},
   B:{cap:30,int:7,intCap:20,pow:1,powCap:20,total:45,ann:4.5}},
 ultra_sel: {name:"અલ્ટ્રા-મેગા · પસંદગીનું થ્રસ્ટ સેક્ટર", ref:"Large GR para 4-H", years:12, epf:10, abs:1250, hpc:true,
   A:{cap:35,int:7,intCap:20,pow:2,powCap:20,total:50,ann:4.5},
   B:{cap:30,int:7,intCap:20,pow:1,powCap:20,total:45,ann:4.0}},
};
