import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  centered?: boolean;
  action?: ReactNode;
  className?: string;
  border?: boolean;
}

export const PageHeader = ({
  title,
  description,
  icon,
  centered = false,
  action,
  className = "",
  border = true,
}: PageHeaderProps) => {
  return (
    <header
      className={`${
        border ? "border-b border-gray-200" : ""
      } bg-white ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        {centered ? (
          <div className="text-center">
            {icon && (
              <div className="flex items-center justify-center gap-3 mb-4">
                {icon}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-gray-600 text-base md:text-lg">
                {description}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 flex-1">
              {icon && icon}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-600">{description}</p>
                )}
              </div>
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
      </div>
    </header>
  );
};
