import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (body.code == undefined && body.teamSelect == undefined) {
            return NextResponse.json({ status: "failed", message: "Nu ai trimis codul sau echipa :( !" }, { status: 400 });
        }
        else {
            const fetchData = await prisma.codes.findMany({
                where: {
                    code: body.code || ''
                }
            });

            const fetchDataAllowVote = await prisma.activeVote.findMany();
            if(fetchDataAllowVote.length === 0 || fetchDataAllowVote[0].isActive == false){
                return NextResponse.json({ status: "failed", message: "Nu poti vota inca!" }, { status: 404 });

            }

            if (fetchData.length === 0) {
                return NextResponse.json({ status: "failed", message: "Codul este invalid :( !" }, { status: 404 });
            }
            else {
                const fetchDataTeams = await prisma.teams.findMany({
                    where: {
                        name: body.teamSelect || ''
                    }
                });

                if (fetchDataTeams.length == 0) {
                    return NextResponse.json({ status: "failed", message: "Nu ai trimis codul sau echipa (JSON) :( !" }, { status: 400 });

                }
                else {

                    if (fetchData[0].isUsed == true) {
                        return NextResponse.json({ status: "failed", message: "Codul a fost deja folosit :( !" }, { status: 403 });
                    }
                    else {
                        await prisma.teams.updateMany({
                            where: {
                                name: body.teamSelect
                            },
                            data: {
                                votes:{increment:1}
                            }
                        });
                        await prisma.codes.update({
                            where: {
                                id: fetchData[0].id
                            },
                            data: {
                                isUsed: true,
                                whenUsed: new Date()
                            }
                        });
                        return NextResponse.json({ status: "ok", message: "Ai votat cu succes!" }, { status: 200 });
                    }
                }
            }
        }
    } catch (error: any) {
        return NextResponse.json({ status: "failed", message: error.message }, { status: 400 });
    } finally {
        prisma.$disconnect();
    }
}
