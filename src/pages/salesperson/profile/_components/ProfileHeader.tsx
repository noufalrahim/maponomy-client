import { Badge } from '@/components/ui/badge';
import { badgeFields, cn, withNA } from '@/lib/utils';
import { TSalesPerson } from '@/types';
import { Phone, Mail } from 'lucide-react';

interface IProfileHeaderProps {
  profile?: TSalesPerson;
  email?: string;
}

export default function ProfileHeader({ profile, email }: IProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-xl border bg-card items-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground">
        {(withNA(profile?.name) as string)?.split(' ').map((n: string) => n[0]).join('')}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{withNA(profile?.name)}</h1>
          <Badge className={cn('cursor-pointer',badgeFields(profile?.active ? 'active' : 'inactive').textColor, badgeFields(profile?.active ? 'active' : 'inactive').bgColor)}>
            {badgeFields(profile?.active ? 'active' : 'inactive').text}
          </Badge>
        </div>

        <p className="text-muted-foreground text-start">Sales Representative</p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {withNA(email)}
          </span>
          {profile?.phoneNumber && (
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {withNA(profile?.phoneNumber)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
