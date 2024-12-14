
from django.urls import path
from .views.login import LoginView
from .views.logout import LogoutView
from .views.tokenRefresh import TokenRefreshView
from .views.change_password import ChangePasswordView
from .views.signup import SignUpView , EmailVerificationView, CompleteProfileView
from .views.reset_password import PasswordResetView, PasswordResetConfirmView, SetNewPasswordView
from .views.twoFA import Enable2FaView, Disable2FaView, CodeQrGenerator, Verify2FaView
from .views.resend_otp import ResendOtpView
from .views.verifyToken import TokenVerifyView
from .views.change_username import ChangeUsernameView
from .views.remove_account import RemoveAccountView

urlpatterns = [
    # Sign Up
    path('signup', SignUpView.as_view(), name='signup'),
    path('signup/verify', EmailVerificationView.as_view(), name='email-verify'),
    path('signup/complete', CompleteProfileView.as_view(), name='complete_profile'),

    # Reset Password
    path('reset', PasswordResetView.as_view(), name="reset-password"),
    path("password-reset/<uidb64>/<token>/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("set-new-password", SetNewPasswordView.as_view(), name="set-new-password"),

    # Login
    path('login', LoginView.as_view(), name="reset-password"),
    path('logout', LogoutView.as_view(), name="reset-password"),

    # Enable 2Fa and Disable 2Fa
    path('2fa/enable', Enable2FaView.as_view(), name="enable-2fa"),
    path('2fa/disable', Disable2FaView.as_view(), name="disable-2fa"),

    # Generating QR code for 2FA
    path('2fa/qr', CodeQrGenerator.as_view(), name="qr-code-2fa"),

    # verifying 2FA
    path('2fa/verify', Verify2FaView.as_view(), name="verify-2fa"),

    # Change Password
    path('change-password', ChangePasswordView.as_view(), name="change-password"),


    # Get Access Token
    path('get-token', TokenRefreshView.as_view(), name="get-token"),


    # Resend OTP email
    path('2fa/resend', ResendOtpView.as_view(), name="resend-otp"),

    # Verify_token
    path('verify_token/', TokenVerifyView.as_view(), name='verify_token'),

    # to test later in settings
    path('change-username', ChangeUsernameView.as_view(), name='change_username'),

    #remove Account
    path('remove-account', RemoveAccountView.as_view(), name='remove_account'),
]
