<?php
/**
 * Posts.
 *
 * @copyright Michael Ueberschaer (MU)
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 * @author Michael Ueberschaer <info@homepages-mit-zikula.de>.
 * @link https://homepages-mit-zikula.de
 * @link http://zikula.org
 * @version Generated by ModuleStudio (https://modulestudio.de).
 */

namespace MU\PostsModule\Container\Base;

use Symfony\Component\Routing\RouterInterface;
use Zikula\Common\Translator\TranslatorInterface;
use Zikula\Common\Translator\TranslatorTrait;
use Zikula\Core\Doctrine\EntityAccess;
use Zikula\Core\LinkContainer\LinkContainerInterface;
use Zikula\ExtensionsModule\Api\ApiInterface\VariableApiInterface;
use Zikula\PermissionsModule\Api\ApiInterface\PermissionApiInterface;
use MU\PostsModule\Helper\ControllerHelper;

/**
 * This is the link container service implementation class.
 */
abstract class AbstractLinkContainer implements LinkContainerInterface
{
    use TranslatorTrait;

    /**
     * @var RouterInterface
     */
    protected $router;

    /**
     * @var PermissionApiInterface
     */
    protected $permissionApi;

    /**
     * @var VariableApiInterface
     */
    protected $variableApi;

    /**
     * @var ControllerHelper
     */
    protected $controllerHelper;

    /**
     * LinkContainer constructor.
     *
     * @param TranslatorInterface    $translator       Translator service instance
     * @param Routerinterface        $router           Router service instance
     * @param PermissionApiInterface $permissionApi    PermissionApi service instance
     * @param VariableApiInterface   $variableApi      VariableApi service instance
     * @param ControllerHelper       $controllerHelper ControllerHelper service instance
     */
    public function __construct(
        TranslatorInterface $translator,
        RouterInterface $router,
        PermissionApiInterface $permissionApi,
        VariableApiInterface $variableApi,
        ControllerHelper $controllerHelper
    ) {
        $this->setTranslator($translator);
        $this->router = $router;
        $this->permissionApi = $permissionApi;
        $this->variableApi = $variableApi;
        $this->controllerHelper = $controllerHelper;
    }

    /**
     * Sets the translator.
     *
     * @param TranslatorInterface $translator Translator service instance
     */
    public function setTranslator(/*TranslatorInterface */$translator)
    {
        $this->translator = $translator;
    }

    /**
     * Returns available header links.
     *
     * @param string $type The type to collect links for
     *
     * @return array List of header links
     */
    public function getLinks($type = LinkContainerInterface::TYPE_ADMIN)
    {
        $contextArgs = ['api' => 'linkContainer', 'action' => 'getLinks'];
        $allowedObjectTypes = $this->controllerHelper->getObjectTypes('api', $contextArgs);

        $permLevel = LinkContainerInterface::TYPE_ADMIN == $type ? ACCESS_ADMIN : ACCESS_READ;

        // Create an array of links to return
        $links = [];

        if (LinkContainerInterface::TYPE_ACCOUNT == $type) {
            if (!$this->permissionApi->hasPermission($this->getBundleName() . '::', '::', ACCESS_OVERVIEW)) {
                return $links;
            }

            if (true === $this->variableApi->get('MUPostsModule', 'linkOwnContentsOnAccountPage', true)) {
                $objectType = 'content';
                if ($this->permissionApi->hasPermission($this->getBundleName() . ':' . ucfirst($objectType) . ':', '::', ACCESS_READ)) {
                    $links[] = [
                        'url' => $this->router->generate('mupostsmodule_' . strtolower($objectType) . '_view', ['own' => 1]),
                        'text' => $this->__('My contents', 'mupostsmodule'),
                        'icon' => 'list-alt'
                    ];
                }
            }

            if ($this->permissionApi->hasPermission($this->getBundleName() . '::', '::', ACCESS_ADMIN)) {
                $links[] = [
                    'url' => $this->router->generate('mupostsmodule_content_adminindex'),
                    'text' => $this->__('Posts Backend', 'mupostsmodule'),
                    'icon' => 'wrench'
                ];
            }


            return $links;
        }

        $routeArea = LinkContainerInterface::TYPE_ADMIN == $type ? 'admin' : '';
        if (LinkContainerInterface::TYPE_ADMIN == $type) {
            if ($this->permissionApi->hasPermission($this->getBundleName() . '::', '::', ACCESS_READ)) {
                $links[] = [
                    'url' => $this->router->generate('mupostsmodule_content_index'),
                    'text' => $this->__('Frontend', 'mupostsmodule'),
                    'title' => $this->__('Switch to user area.', 'mupostsmodule'),
                    'icon' => 'home'
                ];
            }
        } else {
            if ($this->permissionApi->hasPermission($this->getBundleName() . '::', '::', ACCESS_ADMIN)) {
                $links[] = [
                    'url' => $this->router->generate('mupostsmodule_content_adminindex'),
                    'text' => $this->__('Backend', 'mupostsmodule'),
                    'title' => $this->__('Switch to administration area.', 'mupostsmodule'),
                    'icon' => 'wrench'
                ];
            }
        }
        
        if (in_array('content', $allowedObjectTypes)
            && $this->permissionApi->hasPermission($this->getBundleName() . ':Content:', '::', $permLevel)) {
            $links[] = [
                'url' => $this->router->generate('mupostsmodule_content_' . $routeArea . 'view'),
                'text' => $this->__('Contents', 'mupostsmodule'),
                'title' => $this->__('Contents list', 'mupostsmodule')
            ];
        }
        if ($routeArea == 'admin' && $this->permissionApi->hasPermission($this->getBundleName() . '::', '::', ACCESS_ADMIN)) {
            $links[] = [
                'url' => $this->router->generate('mupostsmodule_config_config'),
                'text' => $this->__('Configuration', 'mupostsmodule'),
                'title' => $this->__('Manage settings for this application', 'mupostsmodule'),
                'icon' => 'wrench'
            ];
        }

        return $links;
    }

    /**
     * Returns the name of the providing bundle.
     *
     * @return string The bundle name
     */
    public function getBundleName()
    {
        return 'MUPostsModule';
    }
}
