import { useEffect, useMemo, useState } from 'react';
import {
  FacebookFilled,
  InstagramOutlined,
  WhatsAppOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { handleEntityHook } from '@shared/hooks/handleEntityHook';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';
import { useRouter } from 'next/router';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import Link from 'next/link';
import styles from './Topbar.module.scss';
import { contactUsByWhatsappLink } from '../../../../utils/url.utils';
import {
  BETUEL_GROUP_ADDRESS,
  BETUEL_GROUP_LOCATION,
} from '../../../../utils/constants/company.constants';

export const Topbar = () => {
  const { get, item: company } = handleEntityHook<CompanyEntity>('companies');
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string>();
  const [currentCompany, setCurrentCompany] = useState<CompanyEntity>();

  useEffect(() => {
    const { company: companyIdParam } = router.query;
    if (companyIdParam && companyId !== companyIdParam) {
      setCompanyId(companyIdParam as string);
      get({
        endpoint: EndpointsAndEntityStateKeys.BY_REF_ID,
        slug: companyIdParam as string,
      });
    } else if (!companyIdParam) {
      // setCurrentCompany(undefined);
    }
  }, [router.query]);

  useEffect(() => {
    setCurrentCompany(company);
  }, [company]);

  const whatsappLink = useMemo(
    () => contactUsByWhatsappLink(
      `Hola ${
        company.companyId || ''
      } vi tus productos en el ecommerce, quiero mas información sobre ustedes.`,
    ),
    [company],
  );

  return (
    <div className={styles.TopBar}>
      <Link href={BETUEL_GROUP_LOCATION}>
        <a target="_blank" className="text-black">{BETUEL_GROUP_ADDRESS}</a>
      </Link>
      <div className={styles.TopBarSocialNetworks}>
        <Link href={whatsappLink}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="flex-center-center text-green-4 gap-xx-s"
          >
            <span>¡Contactanos!</span>
            <WhatsAppOutlined rev="" className="font-size-8" />
          </a>
        </Link>

        {currentCompany?.instagram?.url && (
          <Link href={currentCompany?.instagram.url}>
            <a target="_blank">
              <InstagramOutlined
                rev=""
                className="instagram-gradient font-size-8"
                size={40}
              />
            </a>
          </Link>
        )}
        {currentCompany?.facebook?.url && (
          <Link href={currentCompany?.facebook.url}>
            <a target="_blank">
              <FacebookFilled
                rev=""
                className="text-blue font-size-8 rounded"
                size={40}
              />
            </a>
          </Link>
        )}

        {currentCompany?.youtube?.url && (
          <Link href={currentCompany?.youtube.url}>
            <a target="_blank">
              <YoutubeOutlined
                rev=""
                className="text-red-2 font-size-8"
                size={40}
              />
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};
