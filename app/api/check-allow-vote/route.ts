import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient} from "@prisma/client"


const prisma = new PrismaClient();

export async function GET(request: Request) {
    try{
        
        const fetchData = await prisma.activeVote.findMany();

        if(fetchData.length === 0){
            return NextResponse.json({ status:"failed"}, { status: 403 });
        }
        else{
            if(fetchData[0].isActive === false)
                return NextResponse.json({ status:"failed"}, { status: 403 });
            else
                return NextResponse.json({ status:"ok"}, { status: 200 });
        }
            
    }catch(error : any){
        return NextResponse.json({ status:"failed", message: error.message }, { status: 400 });
    }finally{
        prisma.$disconnect();
    }
}
