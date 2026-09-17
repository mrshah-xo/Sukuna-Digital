import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { School, Media } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // In a multi-tenant setup or single default tenant, fetch the primary active school
    const school = await School.findOne({ status: 'ACTIVE' })
      .select('schoolName branding')
      .lean();

    if (!school) {
      return NextResponse.json({
        success: true,
        data: {
          schoolName: 'Sukuna Secondary School',
          schoolDisplayName: 'Sukuna Secondary School',
          appName: 'Sukuna School App',
          logoUrl: null,
          welcomeMessage: 'Welcome to Sukuna School — Where Excellence Meets Innovation',
          slides: [],
        },
      });
    }

    let logoUrl = school.branding?.logo || null;
    if (school.branding?.logoMediaId) {
      const logoMedia = await Media.findById(school.branding.logoMediaId).select('url').lean();
      if (logoMedia) {
        logoUrl = logoMedia.url;
      }
    }

    // Resolve slides from configured branding
    const slides: { id: string; image: string; alt: string; title?: string }[] = [];

    if (school.branding?.homePageHeroBanner) {
      slides.push({
        id: 'hero',
        image: school.branding.homePageHeroBanner,
        alt: school.branding.appName || school.schoolName,
        title: school.branding.welcomeMessage || 'Welcome to Sukuna School',
      });
    }

    if (school.branding?.frame2Image) {
      slides.push({
        id: 'frame2',
        image: school.branding.frame2Image,
        alt: school.branding.frame2Title || 'Education Reimagined',
        title: school.branding.frame2Title || 'Your Education, Reimagined',
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        schoolName: school.schoolName,
        schoolDisplayName: school.branding?.schoolDisplayName || school.schoolName,
        appName: school.branding?.appName || 'Sukuna School App',
        logoUrl,
        welcomeMessage: school.branding?.welcomeMessage || 'Welcome to Sukuna School — Where Excellence Meets Innovation',
        slides,
      },
    });
  } catch (error) {
    console.error('Error fetching public branding:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load branding information' },
      { status: 500 }
    );
  }
}
