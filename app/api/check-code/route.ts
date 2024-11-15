import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient} from "@prisma/client"


const prisma = new PrismaClient();

export async function GET(request: Request) {
    try{
        
        const fetchData = await prisma.codes.findMany({
            where:{
                code: new URL(request.url).searchParams.get('code') || ''
            }
        });

        const fetchDataAllowVote = await prisma.activeVote.findMany();
        if(fetchDataAllowVote.length === 0 || fetchDataAllowVote[0].isActive == false){
            return NextResponse.json({ status: "failed", message: "Nu poti vota inca!" }, { status: 404 });

        }

        if(fetchData.length === 0){
            return NextResponse.json({ status:"failed", message: "Codul este invalid :( !" }, { status: 404 });
        }
        else{
            if (fetchData[0].isUsed == true) {
                return NextResponse.json({ status: "failed", message: "Codul a fost deja folosit :( !" }, { status: 403 });
            }
            else
                return NextResponse.json({ status:"ok",  message: "Codul este valid! Alege echipa favorită!", data:fetchData }, { status: 200 });
        }
            
    }catch(error : any){
        return NextResponse.json({ status:"failed", message: error.message }, { status: 400 });
    }finally{
        prisma.$disconnect();
    }
}
