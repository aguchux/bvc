import { NextRequest } from "next/server";
import { proxyCoursePhotoResponse } from "lib/coursePhotoProxy";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ courseId?: string } | undefined> },
) {
    return proxyCoursePhotoResponse(request, params);
}
